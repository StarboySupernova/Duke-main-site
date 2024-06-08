import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { MdClose, MdMenu, MdSearch } from 'react-icons/md';
import { Link } from 'gatsby';
import HeaderStyles from '../styles/HeaderStyles';
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

    // adding an event listener for when the user clicks anywhere on the page
    document.addEventListener('mousedown', handleClickOutside);

    // unmounting listener to prevent performance issues
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavOpen]);

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
      <Wrapper>
        <Link to="/" /* link to homepage */>
          <img
            src="/images/logos/apetech-logo.png"
            alt="Duke Logo"
            width="50"
            style={{ borderRadius: '40%', position: 'relative' }}
          />
        </Link>
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
            <MenuWrapper count={menu.length} ref={ref}>
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
            </MenuWrapper>
            <div
              ref={
                tooltipRef
              } /* we have to create a container around MenuToolTip to add the ref to,because one cannot attach a ref to custom components */
            >
              <MenuToolTip isOpen={isOpen} />
            </div>
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
          </nav>
        </div>
        <div
          ref={
            tooltipRef
          } /* we have to create a container around MenuToolTip to add the ref to,because one cannot attach a ref to custom components */
        >
          <MenuToolTip isOpen={isOpen} />
        </div>
      </Wrapper>
    </HeaderStyles>
  );
}

export default Header;

const Wrapper = styled.div`
  position: absolute;
  top: 60px;
  display: grid;
  grid-template-columns: 44px auto;
  justify-content: space-between;
  width: 100%; /*when you set position absolute it tends not to take the full width, hence we need to explictly specify width */
  padding: 0 30px;
  align-items: center; /*vertically center items within their respective columns*/

  @media (max-width: 768px) {
    top: 30px;
  }

  @media (max-width: 450px) {
    top: 20px;
    padding: 0 20px;
  }
`;

const MenuWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.count},
    auto
  ); /*first arg is the number of columns, with 2nd arg being the value for each column. Instead of writing auto, auto, auto (for example) */
  gap: 30px;

  /*this only applies when width is less than 768 */
  @media (max-width: 768px) {
    /*CSS selector for anything greater than the immediate children which is an anchor (MenuButton here) */
    > a {
      display: none;
    }

    grid-template-columns: auto;
  }
`;
