'use client';
import Link from 'next/link';
import React from 'react';
import IconLockDots from '../icon/icon-lock-dots';
import IconLogout from '../icon/icon-logout';
import IconMail from '../icon/icon-mail';
import IconUser from '../icon/icon-user';
import { GetUserLogin } from '@/services'; // Ensure this is imported if needed
import { getCookie } from '@/utils/cookieFunction';

export default function UserDropdown() {
  const userData = JSON.parse(getCookie('userData'))

  console.log(userData, "userData");


  return (
    <div className="dropdown">
      <button
        className="btn btn-light dropdown-toggle"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          className="rounded me-2"
          src="/assets/images/profile-placeholder.png"
          alt="User Profile"
          width="20"
          height="20"
        />
        {userData?.firstName}
      </button>
      <ul className="dropdown-menu p-0" aria-labelledby="userDropdown" style={{ width: '300px' }}>
        <li className='m-0'>
          <button className="btn d-flex align-items-center">
            <img
              className="rounded me-2"
              src="/assets/images/profile-placeholder.png"
              alt="User Profile"
              width="40"
              height="40"
            />
            <div>
              <h6 className="mb-0 text-start">
                {userData?.firstName} {userData?.lastName}
              </h6>
              <small className="text-muted">  {userData?.email}</small>
            </div>
          </button>
        </li>
        {/* <li>
          <Link href="/users/profile" className="">
            <IconUser className="me-2" />
            Profile
          </Link>
        </li> */}
        <li className='m-0'>
          <button
            onClick={() => GetUserLogin.logout(() => { })}
            className="btn text-danger w-full"
          >
            <IconLogout className="me-2 rotate-90" />
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}
