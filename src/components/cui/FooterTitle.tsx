import React from 'react';

const FooterTitle = ({ title }: { title: string }) => {
  return (
    <div className="pb-4">
      <h3 className="text-white font-bold text-base sm:text-lg tracking-tight">
        {title}
      </h3>
      <div className="w-8 h-1 rounded-full bg-brandClr2 mt-2 shadow-xs" />
    </div>
  );
};

export default FooterTitle;