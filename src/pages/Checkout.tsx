import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface FlightOffer {
  id: string;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      carrierCode: string;
      number: string;
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; terminal?: string; at: string };
      duration: string;
    }>;
  }>;
  price: { total: string; currency: string };
  travelerPricings: Array<{
    fareDetailsBySegment: Array<{
      includedCheckedBags: { weight: number; weightUnit: string };
      cabin: string;
    }>;
  }>;
}

interface Traveler {
  id: string;
  dateOfBirth: string;
  name: { firstName: string; lastName: string };
  gender: string;
  contact: {
    emailAddress: string;
    phones: Array<{
      countryCallingCode: string;
      number: string;
      deviceType: string;
    }>;
  };
}

const airlineMap: { [key: string]: string } = {
  AI: 'Air India',
  UK: 'Vistara',
  '6E': 'IndiGo',
  SG: 'SpiceJet',
  G8: 'GoAir',
};

const getStopsInfo = (segments: FlightOffer['itineraries'][0]['segments']) => {
    const stops = segments.length - 1;
    return stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`;
  };

  const getAdjustedPrice = (basePrice: number, travelClass: string) => {
    const multipliers: { [key: string]: number } = {
      ECONOMY: 1,
      PREMIUM_ECONOMY: 1.5,
      BUSINESS: 2,
      FIRST: 3,
    };
    return basePrice * (multipliers[travelClass] || 1);
  };

const Checkout = () => {
  const navigate = useNavigate(); // Hook 1
  const location = useLocation(); // Hook 2
  const [toast, setToast] = useState<{ title: string; description: string; open: boolean; variant?: 'default' | 'destructive' }>({
    title: '',
    description: '',
    open: false,
  }); // Hook 3
  const [travelers, setTravelers] = useState<Traveler[]>([]); // Hook 4
  const [formErrors, setFormErrors] = useState<string[]>([]); // Hook 5
  const [loading, setLoading] = useState<boolean>(false); // Hook 6

  // Check if location.state exists, otherwise redirect to Flights page
  useEffect(() => { 
    if (!location.state) {
      setToast({
        title: 'Error',
        description: 'No flight data found. Please select a flight to proceed with booking.',
        open: true,
        variant: 'destructive',
      });
      setTimeout(() => navigate('/flights'), 3000); // Redirect to Flights page after 3 seconds
    }
  }, [location.state, navigate]);

  // Initialize travelers state after confirming location.state exists
  useEffect(() => { // Hook 8
    if (location.state) {
      const { adults } = location.state as {
        flight: FlightOffer;
        selectedClass: string;
        adults: number;
        tripType: 'round-trip' | 'one-way' | 'multi-city';
      };
      setTravelers(
        Array(adults).fill(0).map((_, index) => ({
          id: `${index + 1}`,
          dateOfBirth: '',
          name: { firstName: '', lastName: '' },
          gender: '',
          contact: {
            emailAddress: '',
            phones: [{ countryCallingCode: '91', number: '', deviceType: 'MOBILE' }],
          },
        }))
      );
    }
  }, [location.state]);

  // Validate location.state and flight data
  if (!location.state) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
            <p className="text-center text-gray-600">Redirecting to flight search...</p>
          </section>
          <Footer />
        </div>
        <Toast
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`border rounded-md shadow-lg p-4 ${
            toast.variant === 'destructive' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {toast.variant === 'destructive' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <div className="flex-1">
              <ToastTitle className={`text-sm font-medium ${toast.variant === 'destructive' ? 'text-red-800' : 'text-gray-800'}`}>
                {toast.title}
              </ToastTitle>
              <ToastDescription className={`text-xs ${toast.variant === 'destructive' ? 'text-red-600' : 'text-gray-600'}`}>
                {toast.description}
              </ToastDescription>
            </div>
            <ToastClose />
          </div>
        </Toast>
        <ToastViewport className="fixed bottom-0 right-0 p-4 w-full max-w-sm" />
      </ToastProvider>
    );
  }

  const { flight, selectedClass, adults, tripType } = location.state as {
    flight: FlightOffer;
    selectedClass: string;
    adults: number;
    tripType: 'round-trip' | 'one-way' | 'multi-city';
  };

  const outboundItinerary = flight.itineraries[0];
  const returnItinerary = flight.itineraries[1] || null;
  const outboundFirstSegment = outboundItinerary?.segments[0];
  const outboundLastSegment = outboundItinerary?.segments.slice(-1)[0];

  // Combine the second validation check with the early return
  if (!outboundFirstSegment || !outboundLastSegment) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
            <p className="text-center text-gray-600">Error: Invalid flight data. Please go back and try again.</p>
            <Button
              variant="outline"
              className="mt-4 flex items-center gap-2 text-primary mx-auto"
              onClick={() => navigate('/flights')}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Flights
            </Button>
          </section>
          <Footer />
        </div>
        <ToastViewport className="fixed bottom-0 right-0 p-4 w-full max-w-sm" />
      </ToastProvider>
    );
  }

  const returnFirstSegment = returnItinerary?.segments[0];
  const returnLastSegment = returnItinerary?.segments.slice(-1)[0];
  const airlineName = airlineMap[outboundFirstSegment.carrierCode] || outboundFirstSegment.carrierCode;
  const outboundStops = getStopsInfo(outboundItinerary.segments);
  const returnStops = returnItinerary ? getStopsInfo(returnItinerary.segments) : null;
  const basePrice = parseFloat(flight.price?.total || '0');
  const adjustedPrice = getAdjustedPrice(basePrice, selectedClass);
  const perPassengerPrice = adults > 0 ? adjustedPrice / adults : adjustedPrice;
  const isMultiCity = tripType === 'multi-city';
  const legLabel = isMultiCity ? 'Leg' : '';

  const getAmadeusToken = async () => {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: import.meta.env.VITE_AMADEUS_API_KEY,
          client_secret: import.meta.env.VITE_AMADEUS_API_SECRET,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      return response.data.access_token;
    } catch (err) {
      throw new Error('Failed to authenticate with Amadeus API');
    }
  };

  const confirmFlightPrice = async (flight: FlightOffer, token: string) => {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/shopping/flight-offers/pricing',
        {
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [flight],
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data.flightOffers[0];
    } catch (err) {
      throw new Error('Failed to confirm flight price and availability.');
    }
  };

  const createFlightOrder = async (flight: FlightOffer, travelers: Traveler[], token: string) => {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/booking/flight-orders',
        {
          data: {
            type: 'flight-order',
            flightOffers: [flight],
            travelers,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      throw new Error('Failed to create flight order.');
    }
  };

  const storeBookingDetails = (bookingId: string, email: string) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ bookingId, email });
    localStorage.setItem('bookings', JSON.stringify(bookings));
  };

  const validateForm = () => {
    const errors: string[] = [];
    travelers.forEach((traveler, index) => {
      if (!traveler.name.firstName) errors.push(`First name is required for Traveler ${index + 1}`);
      if (!traveler.name.lastName) errors.push(`Last name is required for Traveler ${index + 1}`);
      if (!traveler.dateOfBirth) errors.push(`Date of birth is required for Traveler ${index + 1}`);
      if (!traveler.gender) errors.push(`Gender is required for Traveler ${index + 1}`);
      if (!traveler.contact.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.contact.emailAddress)) {
        errors.push(`A valid email is required for Traveler ${index + 1}`);
      }
      if (!traveler.contact.phones[0].number || !/^\d{10}$/.test(traveler.contact.phones[0].number)) {
        errors.push(`A valid 10-digit phone number is required for Traveler ${index + 1}`);
      }
    });
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleTravelerChange = (index: number, field: string, value: string) => {
    setTravelers(prev =>
      prev.map((traveler, i) => {
        if (i !== index) return traveler;
        if (field === 'firstName' || field === 'lastName') {
          return { ...traveler, name: { ...traveler.name, [field]: value } };
        }
        if (field === 'emailAddress') {
          return { ...traveler, contact: { ...traveler.contact, emailAddress: value } };
        }
        if (field === 'phoneNumber') {
          return {
            ...traveler,
            contact: {
              ...traveler.contact,
              phones: [{ countryCallingCode: '91', number: value, deviceType: 'MOBILE' }],
            },
          };
        }
        return { ...traveler, [field]: value };
      })
    );
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      setToast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form before proceeding.',
        open: true,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      setToast({
        title: 'Processing Booking',
        description: 'Confirming flight details...',
        open: true,
        variant: 'default',
      });

      const token = await getAmadeusToken();
      const confirmedFlight = await confirmFlightPrice(flight, token);
      const booking = await createFlightOrder(confirmedFlight, travelers, token);

      storeBookingDetails(booking.id, travelers[0].contact.emailAddress);

      setToast({
        title: 'Booking Confirmed',
        description: `Your booking is confirmed! Booking ID: ${booking.id}. View all your bookings in the "My Bookings" section.`,
        open: true,
        variant: 'default',
      });

      setTimeout(() => navigate('/my-bookings'), 3000);
    } catch (err: any) {
      setToast({
        title: 'Booking Failed',
        description: err.message || 'Failed to book the flight. Please try again.',
        open: true,
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (!match) return duration;
    const hours = match[1];
    const minutes = match[2] || '0';
    return `${hours}h ${minutes.padStart(2, '0')}m`;
  };


  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SEO
          title="Checkout"
          description="Complete your booking with Wisdom Travel and Tours."
          path="/checkout"
          noIndex
        />
        <Header />
        <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 text-primary"
            onClick={() => navigate('/flights')}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Flights
          </Button>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Flight Summary */}
            <div className="md:col-span-1">
              <Card className="border-gray-200 rounded-lg bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-primary">Flight Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {airlineName} ({outboundFirstSegment.carrierCode}) {outboundFirstSegment.number}
                    </p>
                    {isMultiCity ? (
                      <p className="text-xs text-gray-500">{legLabel}</p>
                    ) : (
                      <p className="text-xs text-gray-500">{tripType === 'round-trip' ? 'Round Trip' : 'One Way'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 text-sm">
                        {new Date(outboundFirstSegment.departure?.at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <span className="text-gray-500 text-sm">→</span>
                      <p className="font-medium text-gray-800 text-sm">
                        {new Date(outboundLastSegment.arrival?.at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {outboundFirstSegment.departure?.iataCode} → {outboundLastSegment.arrival?.iataCode}
                      {outboundLastSegment.arrival?.terminal && ` (Terminal ${outboundLastSegment.arrival.terminal})`}
                    </p>
                    <p className="text-xs text-gray-600">{formatDuration(outboundItinerary.duration)} • {outboundStops}</p>

                    {returnItinerary && returnFirstSegment && returnLastSegment && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="font-medium text-gray-800 text-sm">
                            {new Date(returnFirstSegment.departure?.at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <span className="text-gray-500 text-sm">→</span>
                          <p className="font-medium text-gray-800 text-sm">
                            {new Date(returnLastSegment.arrival?.at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">
                          {returnFirstSegment.departure?.iataCode} → {returnLastSegment.arrival?.iataCode}
                          {returnLastSegment.arrival?.terminal && ` (Terminal ${returnLastSegment.arrival.terminal})`}
                        </p>
                        <p className="text-xs text-gray-600">{formatDuration(returnItinerary.duration)} • {returnStops}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-800">Class: {selectedClass}</p>
                    <p className="text-sm text-gray-800">Passengers: {adults} Adult{adults > 1 ? 's' : ''}</p>
                    <p className="text-lg font-bold text-primary mt-2">₹{adjustedPrice.toLocaleString('en-IN')}</p>
                    {adults > 1 && (
                      <p className="text-xs text-gray-600">₹{perPassengerPrice.toLocaleString('en-IN')} per passenger</p>
                    )}
                    <p className="text-xs text-gray-600">
                      Baggage: {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight || 0} kg
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traveler Details Form */}
            <div className="md:col-span-2">
              <Card className="border-gray-200 rounded-lg bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-primary">Traveler Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formErrors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                      <ul className="list-disc list-inside text-sm text-red-600 mt-2">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {travelers.map((traveler, index) => (
                    <div key={index} className="space-y-4 border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-medium text-gray-700">Traveler {index + 1}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">First Name</Label>
                          <Input
                            type="text"
                            value={traveler.name.firstName}
                            onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                            className="h-10 border-gray-200 focus:ring-primary"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                          <Input
                            type="text"
                            value={traveler.name.lastName}
                            onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                            className="h-10 border-gray-200 focus:ring-primary"
                            placeholder="Enter last name"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                          <Input
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                            className="h-10 border-gray-200 focus:ring-primary"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Gender</Label>
                          <Select
                            value={traveler.gender}
                            onValueChange={(value) => handleTravelerChange(index, 'gender', value)}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:ring-primary">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                          <Input
                            type="email"
                            value={traveler.contact.emailAddress}
                            onChange={(e) => handleTravelerChange(index, 'emailAddress', e.target.value)}
                            className="h-10 border-gray-200 focus:ring-primary"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                          <div className="flex gap-2">
                            <Select
                              value={`+${traveler.contact.phones[0].countryCallingCode}`}
                              onValueChange={(value) =>
                                handleTravelerChange(index, 'countryCallingCode', value.replace('+', ''))
                              }
                              disabled
                            >
                              <SelectTrigger className="w-24 h-10 border-gray-200 focus:ring-primary">
                                <SelectValue placeholder="+91" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+91">+91</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="text"
                              value={traveler.contact.phones[0].number}
                              onChange={(e) => handleTravelerChange(index, 'phoneNumber', e.target.value)}
                              className="h-10 border-gray-200 focus:ring-primary"
                              placeholder="Enter 10-digit phone number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-md h-12 font-medium disabled:bg-primary/70 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={handleConfirmBooking}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <AlertCircle className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <Footer />
      </div>

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast({ ...toast, open })}
        className={`border rounded-md shadow-lg p-4 ${
          toast.variant === 'destructive' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {toast.variant === 'destructive' ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <div className="flex-1">
            <ToastTitle className={`text-sm font-medium ${toast.variant === 'destructive' ? 'text-red-800' : 'text-gray-800'}`}>
              {toast.title}
            </ToastTitle>
            <ToastDescription className={`text-xs ${toast.variant === 'destructive' ? 'text-red-600' : 'text-gray-600'}`}>
              {toast.description}
            </ToastDescription>
          </div>
          <ToastClose />
        </div>
      </Toast>
      <ToastViewport className="fixed bottom-0 right-0 p-4 w-full max-w-sm" />
    </ToastProvider>
  );
};

export default Checkout;