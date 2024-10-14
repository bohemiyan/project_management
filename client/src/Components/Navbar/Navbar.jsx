import React, { useState } from 'react';
import styled from 'styled-components';
import { RiMessage2Fill } from 'react-icons/ri';
import { IoNotificationsSharp } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assets/netAmericaDeliver.png';
import { FaHeart, FaUser } from 'react-icons/fa';
import { IoMdDocument } from 'react-icons/io';
import { MdRateReview, MdEmail, MdSettings, MdHelp } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { envc } from '../../config';

const Head = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e2e0;
  height: 70px;
  padding: 0;
  margin-bottom:20px;
  z-index: 1000; /* Ensure Navbar is above other content */
`;

const Left = styled.div`
  margin-left: 15px;
  display: flex;
  cursor: pointer;
  div {
    margin-right: 14px;
    margin-top: 3px;
  }
  div:hover {
    border-bottom: 0.125rem solid transparent;
    border-bottom-color: #2557a7;
  }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  div {
    margin-right: 20px;
  }
  div:hover {
    border-bottom: 0.125rem solid transparent;
    border-bottom-color: #2557a7;
  }
  svg {
    height: 1.8rem;
    width: 1.5rem;
  }
`;

const Logo = styled.img`
  width: 150px; /* Set logo width to 150px */
`;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem('userID');
  const role = localStorage.getItem('role');
  const isemp = role === 'emp';
  const isadmin = role === 'admin';
  const isstudent = role === 'student';

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    localStorage.clear();
    // console.log(role, isstudent);
    if (isstudent || isadmin) {
      window.location.href = `${envc.Moodle_url}`;
    } else {
      navigate('/login')
    }
  };


  const open = Boolean(anchorEl);

  return (
    <Head>
      <div onClick={() => { navigate('/') }}>
        <Logo src={logo} alt="Logo" />
      </div>

      <Right>
        {/* <div>
          <RiMessage2Fill />
        </div>
        <div>
          <IoNotificationsSharp />
        </div> */}
        <div onClick={handlePopoverOpen}>
          <FaUser style={{ width: 18 }} />
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList sx={{ padding: '20px', borderRadius: '5px' }}>
            <MenuItem>
              <Typography variant="h6">{user}</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/viewprofile')}>
              <IoMdDocument

                style={{ marginRight: '5px' }} />
              Profile
            </MenuItem>
            {isadmin &&
              <>
                <MenuItem onClick={() => navigate('/jobpage')}>
                  <FaHeart style={{ marginRight: '5px' }} />
                  Jobs
                </MenuItem>
                <MenuItem onClick={() => navigate('/viewcompany')}>
                  <MdRateReview style={{ marginRight: '5px' }} />
                  Companies
                </MenuItem>
              </>

            }
            {isemp &&
              <>
                <MenuItem onClick={() => navigate('/jobpage')}>
                  <FaHeart style={{ marginRight: '5px' }} />
                  My Jobs
                </MenuItem>
                <MenuItem onClick={() => navigate('/viewcompany')}>
                  <MdRateReview style={{ marginRight: '5px' }} />
                  My Company
                </MenuItem>
              </>
            }

            {isstudent &&
              <>
                <MenuItem onClick={() => navigate('/jobpage?applyed=1')}>
                  <FaHeart style={{ marginRight: '5px' }} />
                  Applyed Jobs
                </MenuItem>
                <MenuItem onClick={() => navigate('/jobpage?saved=1')}>
                  <FaHeart style={{ marginRight: '5px' }} />
                  Saved Jobs
                </MenuItem>
                <MenuItem onClick={() => navigate('/resume')}>
                  <FaHeart style={{ marginRight: '5px' }} />
                  Resume
                </MenuItem>
              </>
            }

            {/* <MenuItem>
              <MdEmail style={{ marginRight: '5px' }} />
              Email preferences
            </MenuItem>
            <MenuItem>
              <BsSearch style={{ marginRight: '5px' }} />
              Search preferences
            </MenuItem> */}
            {/* <MenuItem>
              <MdSettings style={{ marginRight: '5px' }} />
              Settings
            </MenuItem>
            <MenuItem>
              <MdHelp style={{ marginRight: '5px' }} />
              Help Center
            </MenuItem> */}
            <MenuItem
              onClick={handleSignout}
              style={{ textAlign: 'center', color: 'rgb(50,87,167)' }}
            >
              {role === 'emp' ? "Sign Out" :" Go back"}
            </MenuItem>
          </MenuList>
        </Popover>
        <div style={{ width: '0.0625rem', height: '0.5rem', backgroundColor: '#d4d2d0' }}></div>
        {role === 'emp' ?
          <Left>
            <Link to="/addjob" style={{ textDecoration: 'none', color: 'inherit' }}>
              Add Job
            </Link>
          </Left>
          :
          <Left>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              All jobs
            </Link>
          </Left>
        }

      </Right>
    </Head>
  );
};

export default Navbar;
