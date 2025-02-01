import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      {children}
    </button>
  );
};
