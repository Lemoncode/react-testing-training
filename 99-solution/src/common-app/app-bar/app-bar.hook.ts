import React from 'react';

export const useMenu = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [menuElement, setMenuElement] = React.useState<HTMLElement>(null);

  const onOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setMenuElement(e.currentTarget);
  };

  const onCloseMenu = () => {
    setOpen(false);
    setMenuElement(null);
  };

  return {
    isOpen,
    menuElement,
    onOpenMenu,
    onCloseMenu,
  };
};
