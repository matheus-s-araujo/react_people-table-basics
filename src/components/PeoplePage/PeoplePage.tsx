import { getPeople } from '../../api';
import { useEffect, useState } from 'react';
import { Person } from '../../types';
import { Loader } from '../Loader';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { PersonLink } from '../PersonLink/PersonLink';

type PeoplePageProps = {
  people: Person[] | null;
  setPeople: (peopleList: Person[]) => void;
};

export const PeoplePage = ({ people, setPeople }: PeoplePageProps) => {
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

  const findParent = (parentName: string) => {
    return people?.find(person => person.name === parentName) ?? null;
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
                        <PersonLink person={person} />
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      {!person.motherName ? (
                        <td>-</td>
                      ) : hasParentOnTheList(person.motherName) ? (
                        <td>
                          <PersonLink person={findParent(person.motherName)} />
                        </td>
                      ) : (
                        <td>{person.motherName}</td>
                      )}

                      {!person.fatherName ? (
                        <td>-</td>
                      ) : hasParentOnTheList(person.fatherName) ? (
                        <td>
                          <PersonLink person={findParent(person.fatherName)} />
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
