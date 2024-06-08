import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { MdClose, MdMenu, MdSearch } from 'react-icons/md';
import { Link } from 'gatsby';
import HeaderStyles from '../styles/HeaderStyles';
import Logo from './Logo';
import ActionButton from './buttons/ActionButton';
import { menu } from '../constants/menu';
import { SearchModalContext } from '../contexts/searchModalContext';
import MenuToolTip from './MenuTooltip';
import { MenuItem, HoverWrapper } from './buttons/MenuButton';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { openSearchModal } = useContext(SearchModalContext); // extracting method from context, given the extraction in SearchModal.js, it seems the extraction is dynamiccally typed, and will correspond with the property name or method name inside our context

  const [isOpen, setIsOpen] =
    useState(
      false
    ); /* react hook. We have option to skip importing React hook by writing React.useState */
  const ref = useRef();
  const tooltipRef = useRef();

  function handleClick(event) {
    setIsOpen(
      !isOpen
    ); /* will not toggle menu on its own because MenuButton is a custom component, and as such it assumes onClick is props instead of an event listener. Hence inside MenuButton, we need to attach to props.onClick inside the respective element (Link in this case) to respond to the onClick method passed-in in this file, and then invoke a method that prevents default behaviour when MenuButton is clicked */
    event.preventDefault();
  }

  function handleClickOutside(event) {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      !tooltipRef.current.contains(event.target)
    ) {
      console.log('Document is clicked');
      setIsOpen(false); /* dismissing tooltip */
    } /* conditional check to prevent conflicting events on tooltip button, such that tapping on toolitp button on this page does not trigger this method, since it already has an onclick event it is supposed to execute. Last condition ensures that clicking on the toolitp itself will not dismiss the tooltip */
  }

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }, [isNavOpen]);

  /* method to listen to every state change. This is typically not ideal, hence we use square brackets to ensure it only runs once */
  useEffect(() => {
    // adding an event listener for when the use clicks anywhere on the page. We'll then run a function every time the document is clicked.
    document.addEventListener('mousedown', handleClickOutside);

    // unmounting listener such that is does not persist across multiple pages, leading to performance issues
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchModalOpen = () => {
    openSearchModal();
  };

  const handleNavItemClick = () => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  };

  const [ishover, setIshover] = useState(false);

  function MouseOver() {
    setIshover(true);
  }
  function MouseOut() {
    setIshover(false);
  }

  return (
    <HeaderStyles>
      <div className="container">
        <div className="header__container">
          <div className="logo">
            <Logo />
          </div>
          <div className={clsx('nav__wrapper', isNavOpen && 'open')}>
            <div className="mobileIcon">
              <div className="searchIcon">
                <div
                  className="searchIcon__wrapper"
                  onClick={handleSearchModalOpen}
                  onKeyDown={handleSearchModalOpen}
                  tabIndex={0}
                  role="button"
                >
                  <MdSearch />
                </div>
              </div>
              <ActionButton
                className="mobileMenuBtn"
                onKeyDown={() => setIsNavOpen(true)}
                onClick={() => setIsNavOpen(true)}
              >
                <MdMenu />
              </ActionButton>
            </div>
            {/* functionality to close menu upon clicking outside nav menu in mobile */}
            {isNavOpen && (
              <div
                aria-label="Close Menu"
                role="button"
                tabIndex={0}
                className="mobileNavBg"
                onKeyDown={() => setIsNavOpen(false)}
                onClick={() => setIsNavOpen(false)}
              />
            )}
            <nav>
              <ActionButton
                className="mobileMenuCloseBtn"
                onClick={() => setIsNavOpen(false)}
                onKeyDown={() => setIsNavOpen(false)}
              >
                <MdClose />
              </ActionButton>
              <ul>
                {menu.map((item) =>
                  item.path === '/account' ? (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={(event) => handleClick(event)}
                      >
                        <HoverWrapper
                          isHover={ishover}
                          onMouseEnter={() => MouseOver()}
                          onMouseLeave={() => MouseOut()}
                        >
                          <MenuItem title={item.title}>
                            <img src={item.icon} alt={item.title} />
                            {item.title}
                          </MenuItem>
                        </HoverWrapper>
                      </Link>
                    </li>
                  ) : (
                    <li key={item.path}>
                      <Link to={item.path} onClick={handleNavItemClick}>
                        <HoverWrapper
                          isHover={ishover}
                          onMouseEnter={() => MouseOver()}
                          onMouseLeave={() => MouseOut()}
                        >
                          <MenuItem title={item.title}>
                            <img src={item.icon} alt={item.title} />
                            {item.title}
                          </MenuItem>
                        </HoverWrapper>
                      </Link>
                    </li>
                  )
                )}
                <li className="searchIcon">
                  <div
                    className="searchIcon__wrapper"
                    onClick={handleSearchModalOpen}
                    onKeyDown={handleSearchModalOpen}
                    tabIndex={0}
                    role="button"
                  >
                    <MdSearch />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div
        ref={
          tooltipRef
        } /* we have to create a container around MenuToolTip to add the ref to,because one cannot attach a ref to custom components */
      >
        <MenuToolTip isOpen={isOpen} />
      </div>
    </HeaderStyles>
  );
}

export default Header;

// /*Display is none by default, until media query determines the screen to be iPad or less */

const HamburgerWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
