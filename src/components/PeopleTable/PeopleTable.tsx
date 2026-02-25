import { getPeople } from '../../api';
import { useEffect, useState } from 'react';
import { Person } from '../../types';
import { Loader } from '../Loader';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

type PeopleTableProps = {
  people: Person[] | null;
  setPeople: (peopleList: Person[]) => void;
};

export const PeopleTable = ({ people, setPeople }: PeopleTableProps) => {
  const [isLoadingPeople, setIsLoadingPeople] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { slug } = useParams();

  useEffect(() => {
    setErrorMessage('');
    setIsLoadingPeople(true);

    getPeople()
      .then(setPeople)
      .catch(() => setErrorMessage('Something went wrong'))
      .finally(() => setIsLoadingPeople(false));
  }, []);

  const hasParentOnTheList = (parentName: string) => {
    return people?.find(person => person.name === parentName);
  };

  const findParentSlug = (parentName: string) => {
    const parentFound = people?.find(person => person.name === parentName);

    return parentFound?.slug;
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoadingPeople && <Loader />}

          {errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              {errorMessage}
            </p>
          )}

          {!isLoadingPeople && people && people?.length <= 0 ? (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          ) : (
            !isLoadingPeople &&
            people &&
            people?.length >= 0 && (
              <table
                data-cy="peopleTable"
                className="table is-striped is-hoverable is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Mother</th>
                    <th>Father</th>
                  </tr>
                </thead>

                <tbody>
                  {people?.map(person => (
                    <tr
                      data-cy="person"
                      key={person.name}
                      className={classNames({
                        'has-background-warning': person.slug === slug,
                      })}
                    >
                      <td>
                        <NavLink
                          to={`/people/${person.slug}`}
                          className={classNames({
                            'has-text-danger': person.sex === 'f',
                          })}
                        >
                          {person.name}
                        </NavLink>
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      {!person.motherName ? (
                        <td>-</td>
                      ) : hasParentOnTheList(person.motherName) ? (
                        <td>
                          <NavLink
                            to={`/people/${findParentSlug(person.motherName)}`}
                            className="has-text-danger"
                          >
                            {person.motherName}
                          </NavLink>
                        </td>
                      ) : (
                        <td>{person.motherName}</td>
                      )}

                      {!person.fatherName ? (
                        <td>-</td>
                      ) : hasParentOnTheList(person.fatherName) ? (
                        <td>
                          <NavLink
                            to={`/people/${findParentSlug(person.fatherName)}`}
                          >
                            {person.fatherName}
                          </NavLink>
                        </td>
                      ) : (
                        <td>{person.fatherName}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </>
  );
};
