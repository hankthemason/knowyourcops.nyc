import React from 'react'

export const AboutPage = props => {

	return (
		<div className='page-container' style={{width: '60%'}}>
			<h1>About the data</h1>
			<div className='about-page'>
				<p>
					This data was generously provided by {" "}
					<a href='https://projects.propublica.org/nypd-ccrb/'>
						Pro Publica
					</a>
					.  It was released in July, 2020, and spans a period from September, 1985 until January, 2020.
				</p>
				<p>
					The following conclusions have been drawn from the way the data was released and presented.  
					The data was released as a set of 33,358 allegations.  
					Each allegation has been made by an individual complainant against an officer.  
					Every time an allegation is made, that allegation forms a part of a complaint, which has at least one allegation on it, but can include allegations from multiple complainants against multiple officers.  
					Each instance of alleged misconduct requires its own allegation.  Therefore, a single complaint may include multiple officers and multiple complainants, but an allegation can only be made by an individual complainant against an individual officer.
				</p>
				<p>
					The command units listed on this web site represent any unit of the NYPD for which an officer assigned to that unit has had an allegation made against them.  
					Additionally, command units are listed that might not be associated directly with an allegation, but are the current assignment of an officer with an allegation 
					(in other words, these additional command units are only present in the database because an officer who is currently assigned to one of them has had an allegation lodged against them, but while serving in another command unit).
				</p>
			</div>
		</div>
	)
}