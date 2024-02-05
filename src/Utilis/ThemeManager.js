/*eslint-disable*/
import React from 'react';
import {
    Dimensions,
} from 'react-native';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {

    //theme = light, dark
    const [theme, setTheme] = React.useState('Light');
    const [OFPData, setOFPData] = React.useState([]);
    const [Orientation, setOrientation] = React.useState('Portrait');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const toggleTheme = () => {
        if (theme === 'Light') {
            setTheme('Dark');
        } else {
            setTheme('Light');
        }
    }

    const setOFPDataMethod = (data) => {
        console.log('setOFPData ==', data);
        setOFPData(data);
    }

    const setOrientationValue = (orientation) => {
        console.log('orientation ==', orientation);
        setOrientation(orientation);
    }

    const setIsLoggedInnValue = (value) => {
        console.log('isLoggedIn new value==', value);
        setIsLoggedIn(value);
    }

    return (
        <ThemeContext.Provider value={{
            theme, toggleTheme,
            OFPData, setOFPDataMethod,
            Orientation, setOrientationValue,
            isLoggedIn, setIsLoggedInnValue
        }}>
            {children}
        </ThemeContext.Provider>
    )
}