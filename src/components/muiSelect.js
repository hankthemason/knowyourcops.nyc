import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

export const MuiSelect = props => {

	const { handler, value } = props

	const [state, setState] = useState('allegations')
	
	return (
		<FormControl /*className={classes.formControl}*/>
    	<InputLabel htmlFor="show-native-helper">Show:</InputLabel>
      <NativeSelect
        value={value}
        onChange={handler}
        inputProps={{
          name: 'show',
          id: 'show-native-helper',
        }}
      >
        <option value={'allegations'}>Allegations</option>
        <option value={'complaints'}>Complaints</option>
      </NativeSelect>
      <FormHelperText>Which data to visualize</FormHelperText>
    </FormControl>
  )
}