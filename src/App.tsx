import './App.scss';
import { HomePage } from './components/HomePage/HomePage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { PeopleTable } from './components/PeopleTable/PeopleTable';
import classNames from 'classnames';
import { useState } from 'react';
import { Person } from './types';

const getActiveNavBarLink = ({ isActive }: { isActive: boolean }) => {
  return classNames('navbar-item', { 'has-background-grey-lighter': isActive });
};

export const App = () => {
  const [people, setPeople] = useState<Person[] | null>(null);

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" className={getActiveNavBarLink}>
              Home
            </NavLink>
            <NavLink to="/people" className={getActiveNavBarLink}>
              People
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="container">
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="people">
                <Route
                  index
                  element={
                    <PeopleTable people={people} setPeople={setPeople} />
                  }
                />
                <Route
                  path=":slug"
                  element={
                    <PeopleTable people={people} setPeople={setPeople} />
                  }
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </div>
      </main>
    </div>
  );
};
