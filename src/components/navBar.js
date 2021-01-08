import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Button, Link } from "@material-ui/core"
import { Home } from "@material-ui/icons"


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
  { title: `precincts map`, path: `/precinctsMap` }
]


export const NavBar = (props) => {

	const { header, menuButton, toolbar, menuButtons } = useStyles()

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

	return (
	  <AppBar className={header} position="static" elevation={0}>
	    <Toolbar className={toolbar}  disableGutters={true}> 
	    	{kycLogo()}
	    	<div className={menuButtons} padding-left="100px">
	    		{getMenuButtons()}
	    	</div>
	    </Toolbar>
	  </AppBar>
  )
}