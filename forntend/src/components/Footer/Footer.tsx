export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full flex flex-col items-center justify-between py-3 gap-3">
      <div className="w-full flex justify-between items-center flex-wrap">
        <a href="tel:+7(904) 609-39-90" className="text-sm hover:text-accent">
          +7(904) 609-39-90
        </a>
        <a
          href="https://t.me/Brend_Eloma"
          className="text-sm hover:text-accent"
        >
          Brend_Eloma
        </a>
        <a
          href="mailto:transchet@gmail.com"
          className="text-sm hover:text-accent"
        >
          transchet@gmail.com
        </a>
      </div>
      <p className="text-sm">
        &copy; 2023 - {currentYear} YAGAart. All rights reserved.
      </p>
    </footer>
  );
};
