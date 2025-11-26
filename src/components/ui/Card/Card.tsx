import React from 'react';
import styles from './Card.module.scss';

const Card = (props: React.PropsWithChildren<{ className?: string }>) => {
  return <div className={`${styles.card} ${props.className}`}>{props.children}</div>;
};

export default Card;
