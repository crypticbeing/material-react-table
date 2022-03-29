import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import {
  Chip,
  debounce,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@mui/material';
import { useMRT } from '../useMRT';
import type { MRT_Header } from '..';
import { MRT_FilterTypeMenu } from '../menus/MRT_FilterTypeMenu';
import { MRT_FILTER_TYPE } from '../enums';

interface Props {
  header: MRT_Header;
}

export const MRT_FilterTextField: FC<Props> = ({ header }) => {
  const {
    icons: { FilterListIcon, CloseIcon },
    idPrefix,
    localization,
    muiTableHeadCellFilterTextFieldProps,
    setCurrentFilterTypes,
    tableInstance: { getState },
  } = useMRT();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const mTableHeadCellFilterTextFieldProps =
    muiTableHeadCellFilterTextFieldProps instanceof Function
      ? muiTableHeadCellFilterTextFieldProps(header.column)
      : muiTableHeadCellFilterTextFieldProps;

  const mcTableHeadCellFilterTextFieldProps =
    header.column.muiTableHeadCellFilterTextFieldProps instanceof Function
      ? header.column.muiTableHeadCellFilterTextFieldProps(header.column)
      : header.column.muiTableHeadCellFilterTextFieldProps;

  const textFieldProps = {
    ...mTableHeadCellFilterTextFieldProps,
    ...mcTableHeadCellFilterTextFieldProps,
  } as TextFieldProps;

  const [filterValue, setFilterValue] = useState('');

  const handleChange = debounce((value: string) => {
    header.column.setColumnFilterValue(value ?? undefined);
  }, 150);

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setFilterValue('');
    header.column.setColumnFilterValue(undefined);
  };

  // const handleClearFilterChip = () => {
  //   setFilterValue('');
  //   header.column.setColumnFilterValue(undefined);
  //   setCurrentFilterTypes((prev) => ({
  //     ...prev,
  //     [header.id]: MRT_FILTER_TYPE.BEST_MATCH,
  //   }));
  // };

  // if (header.Filter) {
  //   return <>{header.Filter?.({ column: header })}</>;
  // }

  const filterId = `mrt-${idPrefix}-${header.id}-filter-text-field`;
  // const filterType = getState().currentFilterTypes?.[header.id];
  const isSelectFilter = !!header.column.filterSelectOptions;
  const filterChipLabel = '';
  //   !(filterType instanceof Function) &&
  //   [MRT_FILTER_TYPE.EMPTY, MRT_FILTER_TYPE.NOT_EMPTY].includes(
  //     filterType as MRT_FILTER_TYPE,
  //   )
  //     ? //@ts-ignore
  //       localization[
  //         `filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`
  //       ]
  //     : '';
  const filterPlaceholder = localization.filterByColumn?.replace(
    '{column}',
    String(header.column.header),
  );

  return (
    <>
      <TextField
        fullWidth
        id={filterId}
        inputProps={{
          // disabled: !!filterChipLabel,
          sx: {
            textOverflow: 'ellipsis',
            // width: filterChipLabel ? 0 : undefined,
          },
          title: filterPlaceholder,
        }}
        // helperText={
        //   <label htmlFor={filterId}>
        //     {filterType instanceof Function
        //       ? localization.filterMode.replace(
        //           '{filterType}',
        //           // @ts-ignore
        //           localization[
        //             `filter${
        //               filterType.name.charAt(0).toUpperCase() +
        //               filterType.name.slice(1)
        //             }`
        //           ] ?? '',
        //         ) ?? ''
        //       : localization.filterMode.replace(
        //           '{filterType}',
        //           // @ts-ignore
        //           localization[
        //             `filter${
        //               filterType.charAt(0).toUpperCase() + filterType.slice(1)
        //             }`
        //           ],
        //         )}
        //   </label>
        // }
        FormHelperTextProps={{
          sx: { fontSize: '0.6rem', lineHeight: '0.8rem' },
        }}
        label={isSelectFilter && !filterValue ? filterPlaceholder : undefined}
        margin="none"
        placeholder={
          filterPlaceholder
          // filterChipLabel || isSelectFilter ? undefined : filterPlaceholder
        }
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFilterValue(e.target.value);
          handleChange(e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
        select={isSelectFilter}
        value={filterValue ?? ''}
        variant="standard"
        InputProps={{
          startAdornment: !isSelectFilter && (
            <InputAdornment position="start">
              <Tooltip arrow title={localization.changeFilterMode}>
                <span>
                  <IconButton
                    aria-label={localization.changeFilterMode}
                    onClick={handleFilterMenuOpen}
                    size="small"
                    sx={{ height: '1.75rem', width: '1.75rem' }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </span>
              </Tooltip>
              {/* {filterChipLabel && (
                <Chip
                  onDelete={handleClearFilterChip}
                  label={filterChipLabel}
                />
              )} */}
            </InputAdornment>
          ),
          endAdornment: !filterChipLabel && (
            <InputAdornment position="end">
              <Tooltip
                arrow
                disableHoverListener={isSelectFilter}
                placement="right"
                title={localization.clearFilter ?? ''}
              >
                <span>
                  <IconButton
                    aria-label={localization.clearFilter}
                    disabled={!filterValue?.length}
                    onClick={handleClear}
                    size="small"
                    sx={{
                      height: '1.75rem',
                      width: '1.75rem',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        {...textFieldProps}
        sx={{
          m: '-0.25rem',
          p: 0,
          minWidth: !filterChipLabel ? '5rem' : 'auto',
          width: 'calc(100% + 0.5rem)',
          mt: isSelectFilter && !filterValue ? '-1rem' : undefined,
          '&	.MuiSelect-icon': {
            mr: '1.5rem',
          },
          ...textFieldProps?.sx,
        }}
      >
        {isSelectFilter && (
          <MenuItem divider disabled={!filterValue} value="">
            {localization.clearFilter}
          </MenuItem>
        )}
        {header.column?.filterSelectOptions?.map((option) => {
          let value;
          let text;
          if (typeof option === 'string') {
            value = option;
            text = option;
          } else if (typeof option === 'object') {
            value = option.value;
            text = option.text;
          }
          return (
            <MenuItem key={value} value={value}>
              {text}
            </MenuItem>
          );
        })}
      </TextField>
      <MRT_FilterTypeMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
      />
    </>
  );
};
