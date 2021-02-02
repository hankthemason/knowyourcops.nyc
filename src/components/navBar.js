import React, {useState, useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Button, Link, Menu, MenuItem } from "@material-ui/core"
import { Home } from "@material-ui/icons"
import MenuIcon from "@material-ui/icons/Menu"


const useStyles = makeStyles({
  header: {
    //backgroundColor: "#400CCC",
    // paddingRight: "79px",
     paddingLeft: "10px",
  },
  menuButton: {
      //fontFamily: "Open Sans, sans-serif",
      //fontWeight: 700,
      size: "18px",
      //marginLeft: "100px",
  },
  menuButtons: {
  	paddingLeft: "50px" 
  }
  //  toolbar: {
  //   display: "flex",
  //   justifyContent: "space-between",
  // },
});

const navLinks = [
  { title: `cops`, path: `/cops` },
  { title: `command units`, path: `/command_units` },
  { title: `precincts map`, path: `/precinctsMap` },
  { title: `about the data`, path: `/about`}
]


export const NavBar = (props) => {

	const { header, menuButton, toolbar, menuButtons } = useStyles()

	 const [state, setState] = useState({
    mobileView: false,
    anchorEl: null
  })
	const { mobileView } = state;

	useEffect(() => {
    const setResponsiveness = () => {
    	
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };
    
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

	const getMenuButtons = () => {
	  return navLinks.map(({ title, path }) => {
	    return (
	      <Button
	        {...{
	          key: title,
	          color: "inherit",
	          to: path,
	          component: RouterLink,
	          className: menuButton
	        }}
	      >
	        {title}
	      </Button>
	    );
	  });
	};

	const kycLogo = () => {
		
		const preventDefault = (event) => event.preventDefault();
		
		return (
	    <Typography variant="h6" component="h1">
	    	<Link href="/cops" color="inherit" underline="none">
	      	KnowYourCops.nyc
	    	</Link>
	    </Typography>
    )
  };
  console.log(state)
  const displayMobile = () => {

  	const openMenu = e => {
    	setState((prevState) => ({ ...prevState, anchorEl: e.currentTarget }))
  	};
  	const closeMenu = () => {
    	setState((prevState) => ({ ...prevState, anchorEl: null }));
  	};
  	
  	return (
  		<Toolbar>
	  		<IconButton
	  			{...{
	  				edge: "start",
	  				color: "inherit",
	  				'aria-label': "menu",
	  				'aria-haspopup': "true",
	  				onClick: openMenu
	  			}}
	  		>
	  			<MenuIcon />
	  		</IconButton>
	  		<Menu
            anchorEl={state.anchorEl}
            keepMounted
            open={Boolean(state.anchorEl)}
            onClose={closeMenu}
        >
        {navLinks.map(({ title, path }) => (
        	
        	<Link href={path}>
        		<MenuItem>{title}</MenuItem>
        	</Link>
        	)
        )}
        </Menu>
	  	<div>{kycLogo()}</div>
	  </Toolbar>
	  )
	}

	const displayDesktop = () => {
		return (
			<Toolbar className={toolbar}  disableGutters={true}> 
	    	{kycLogo()}
	    	<div className={menuButtons} padding-left="100px">
	    		{getMenuButtons()}
	    	</div>
	    </Toolbar>
	  )
	}

	return (
	  <AppBar className={header} position="static" elevation={0}>
	    {mobileView ? displayMobile() : displayDesktop()}
	  </AppBar>
  )
}