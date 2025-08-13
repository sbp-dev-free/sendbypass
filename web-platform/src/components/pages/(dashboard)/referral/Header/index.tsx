export const Header = () => {
  return (
    <>
      <div className="mt-12 mb-32 md:hidden">
        <div className="text-title-large text-on-surface">Referral program</div>
        <div className="text-body-small text-on-surface-variant">
          Share SendBypass with your network and earn exclusive benefits for
          every new user you bring in. The more you share, the more you earn!
        </div>
      </div>
      <div className="bg-primary rounded-medium hidden md:flex md:px-24 md:py-16 md:h-[220px]  md:justify-start md:items-center md:mb-16">
        <div className="md:w-[370px]">
          <div className="text-title-large text-on-primary">
            Referral program
          </div>
          <div className="text-body-small text-on-primary">
            Share SendBypass with your network and earn exclusive benefits for
            every new user you bring in. The more you share, the more you earn!
          </div>
        </div>
      </div>
    </>
  );
};
