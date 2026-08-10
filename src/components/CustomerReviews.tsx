const CustomerReviews = () => {
  return (
    <section className="relative flex flex-col justify-center bg-[#F1F5F9] py-16 lg:py-24 lg:pb-32 overflow-x-hidden no-scrollbar">
      <div className="container-custom w-full px-6 sm:px-8 lg:px-0">

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Header Entity */}
          <div className="lg:col-span-4 text-left space-y-3 lg:space-y-6 animate-fade-in lg:pr-8 mb-10 lg:mb-0">
            <div className="space-y-2 lg:space-y-3">
              <div className="inline-flex items-center px-2 py-0.5 bg-primary/10 rounded-full text-primary font-bold text-[8px] lg:text-[10px] tracking-widest uppercase">
                Testimonials
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
                What Our <br className="hidden lg:block" /> <span className="gradient-text">Guests Say</span>
              </h2>
            </div>
            <p className="max-w-[280px] lg:max-w-md text-[13px] lg:text-lg text-slate-600 leading-relaxed font-medium">
              Real stories from travelers who experienced the world with Wisdom Travel & Tours.
            </p>
            {/* <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-1 bg-primary/30 rounded-full" />
              <span className="text-slate-400 text-sm font-medium italic">Scroll through the love</span>
            </div> */}
          </div>

          {/* Live Google Reviews (Elfsight) */}
          <div className="lg:col-span-8 relative px-0">
            <div className="elfsight-app-afa28580-839c-4e4b-8af6-9e889a6f411c" data-elfsight-app-lazy></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;