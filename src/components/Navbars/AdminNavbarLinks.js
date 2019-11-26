import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
// core components
import Button from 'components/CustomButtons/Button';
import history from 'history.js';
import CustomInput from 'components/CustomInput/CustomInput';
import styles from 'assets/jss/material-dashboard-react/components/headerLinksStyle';
import { actions } from 'store';

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleChange = (event) => {    
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (history.location !== '/admin/buscar' && searchTerm !== '') {
      history.push('/admin/buscar');
    } if (searchTerm !== '') {
      if (!Number(searchTerm) && searchTerm.length < 12) {
        actions.getItemsInBlock(searchTerm);
      } else if (Number(searchTerm)) {
        actions.getInventory([{name: 'sku', value: searchTerm}, {name: 'active', value: -1}]);  
      }
    } 
    
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const color = {
    fontColor: 'white',
  };
  return (
    <div>
      <div className={classes.searchWrapper}>
        <TextField
          id="outlined"
          label="Buscar"
          placeholder="SKU/Estilo/Ubicación"
          value={searchTerm}
          onChange={handleChange}
          autoFocus
          onKeyPress={handleKeyPress}
          margin="dense"
          style={{ marginTop: '-5px' }}
        />
        <Button color="white" aria-label="edit" justIcon round onClick={handleSearch}>
          <Search />
        </Button>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? 'profile-menu-list-grow' : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            `${classNames({ [classes.popperClose]: !openProfile })
            } ${
              classes.popperNav}`
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Perfil
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Opciones
                    </MenuItem>
                    <Divider light />
                    <Link style={color} to="/login">
                      <MenuItem
                        className={classes.dropdownItem}
                      >
                      Cerrar sesión
                      </MenuItem>
                    </Link>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
