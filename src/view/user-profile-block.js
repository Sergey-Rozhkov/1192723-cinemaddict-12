export const createUserProfileBlockTemplate = (filmsCount) => {
  let rating = ``;
  if (filmsCount === 0) {
    rating = ``;
  } else if (filmsCount >= 1 && filmsCount <= 10) {
    rating = `novice`;
  } else if (filmsCount <= 20) {
    rating = `fan`;
  } else {
    rating = `movie buff`;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
