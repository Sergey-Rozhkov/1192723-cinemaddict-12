import {generateDate, getRandomElements, getRandomElement, getRandomInteger, getRandomFloat} from "../utils/common";
import {generateComments} from "./comment";
import {MIN_MOCK_FILM_DURATION, MAX_MOCK_FILM_DURATION} from "../const";

const names = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`
];

const pathToPosterFolder = `./images/posters/`;
const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const genres = [
  `Comedy`,
  `Drama`,
  `Musical`,
  `Western`,
  `Film-Noir`,
  `Mystery`
];

const countries = [
  `USA`,
  `Germany`,
  `France`,
  `Russia`
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const actors = [
  `John Black`,
  `Anthony Tyler`,
  `Thomas Webster`,
  `Stewart Reynolds`,
  `Norah Bishop`,
  `Cameron Owens`
];

const people = [
  `John Black`,
  `Anthony Tyler`,
  `Thomas Webster`,
  `Stewart Reynolds`,
  `Norah Bishop`,
  `Cameron Owens`
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateName = () => {
  return getRandomElement(names);
};

const generatePoster = () => {
  const randomIndex = getRandomInteger(0, posters.length - 1);

  return `${pathToPosterFolder}${posters[randomIndex]}`;
};

const generateGenre = () => {
  const genresCount = getRandomInteger(1, genres.length - 1);

  return getRandomElements(genres, genresCount);
};

const generateCountry = () => {
  const countryCount = getRandomInteger(1, countries.length - 1);

  return getRandomElements(countries, countryCount);
};

const generateDescription = (limit) => {
  const sentenceCount = getRandomInteger(1, limit);

  return getRandomElements(descriptions, sentenceCount).join(` `);
};

const generateDuration = () => {
  return getRandomInteger(MIN_MOCK_FILM_DURATION, MAX_MOCK_FILM_DURATION);
};

const generateProducer = () => {
  return getRandomElement(actors);
};

const generatePeople = (limit) => {
  const count = getRandomInteger(1, limit);

  return getRandomElements(people, count);
};

export const generateFilm = () => {
  const name = generateName();
  const poster = generatePoster();

  return {
    id: generateId(),
    poster,
    fullPoster: poster,
    name,
    originalName: name,
    producer: generateProducer(),
    writers: generatePeople(getRandomInteger(1, 3)),
    actors: generatePeople(getRandomInteger(1, 5)),
    rating: getRandomFloat(1, 10),
    date: generateDate(),
    duration: generateDuration(),
    genres: generateGenre(),
    countries: generateCountry(),
    shortDescription: generateDescription(5),
    description: generateDescription(20),
    comments: generateComments(getRandomInteger(0, 5)),
    ageRating: getRandomInteger(0, 18),
    inWatchlist: Boolean(getRandomInteger(0, 1)),
    isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
