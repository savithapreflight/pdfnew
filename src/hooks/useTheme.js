import React from 'react';
import {Light} from '../theme/light';

export const ThemeContext = React.createContext({
  theme: Light,
  setTheme: () => {},
});

export const ThemeProvider = ({
  children,
  theme = Light,
  setTheme = () => {},
}) => {
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const {theme} = React.useContext(ThemeContext);
  return theme;
};

export default useTheme;
