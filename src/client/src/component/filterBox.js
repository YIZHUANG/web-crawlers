import React from 'react';

const FilterComp = ({ word, onClick, index }) => {
  return (
    <div key={index} className="filter-box__container__content-component">
      <span className="filter-box__container__content-component--keyword">
        {word}
      </span>
      <span
        onClick={() => onClick(index)}
        className="filter-box__container__content-component--button"
      >
        &times;
      </span>
    </div>
  );
};
const FilterBox = ({ title, words, onSubmit, onChange, value, onClick }) => {
  return (
    <div className="filter-box__container">
      <div className="filter-box__container--title">{title}</div>
      <div className="filter-box__container__content">
        {words.map((word, index) => (
          <FilterComp index={index} onClick={onClick} word={word} />
        ))}
      </div>
      <form className="filter-box__container-form" onSubmit={onSubmit}>
        <input
          placeholder="keyword"
          className="filter-box__container-form--input"
          onChange={onChange}
          value={value}
        />
      </form>
    </div>
  );
};

export default FilterBox;
