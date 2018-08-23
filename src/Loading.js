import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Loading.css';

export default function () {
  return <div className="loading-container"><CircularProgress className="loading" size={50} /></div>;
}
