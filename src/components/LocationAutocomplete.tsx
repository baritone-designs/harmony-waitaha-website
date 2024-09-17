import { useState, useRef, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import { FaLocationArrow } from 'react-icons/fa';
import clsx from 'clsx';
import { useField } from 'formik';

interface LocationAutocompleteProps {
    idField: string;
    nameField: string;
    label: string;
    noOptionsText?: string;
}

/**
 * Formik field which allows the selection of a location from google maps
 *
 * @param idField - The name of the formik field for the place_id of the selected location
 * @param nameField - The name of the formik field for the name of the selected location
 */
export default function LocationAutocomplete({ idField, nameField, label, noOptionsText }: LocationAutocompleteProps) {
    const [{ value: idValue }, _1, { setValue: setIdValue }] = useField<string>(idField);
    const [{ value: nameValue, onBlur }, { error, touched }, { setValue: setNameValue }] = useField<string>(nameField);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<readonly google.maps.places.AutocompletePrediction[]>([]);
    const autocompleteService = useRef(new google.maps.places.AutocompleteService());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetch = useCallback(debounce((
        request: { input: string },
        callback: (results: readonly google.maps.places.AutocompletePrediction[] | null) => void,
    ) => {
        autocompleteService.current.getPlacePredictions(
            request,
            callback,
        );
    }, 400), []);

    useEffect(() => {
        let active = true;

        if (!inputValue) {
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly google.maps.places.AutocompletePrediction[] | null) => {
            if (active && results !== null) {
                if (results) {
                    setOptions(results);
                }
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetch]);

    return (
        <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(placeId) => options.find((option) => option.place_id === placeId)?.structured_formatting.main_text ?? nameValue}
            filterOptions={(x) => x}
            options={options.map((option) => option.place_id)}
            autoComplete
            includeInputInList
            value={idValue}
            noOptionsText={noOptionsText}
            onChange={(_e, newValue) => {
                const option = options.find((option) => option.place_id === newValue);
                setIdValue(newValue ?? '');
                setNameValue(option?.structured_formatting.main_text ?? '');
            }}
            onInputChange={(_e, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    onBlur={onBlur}
                    error={touched && Boolean(error)}
                    helperText={(touched && error) || ' '}
                />
            )}
            renderOption={(props, placeId) => {
                const { key, ...optionProps } = props;
                const option = options.find((option) => option.place_id === placeId);
                if (!option) {
                    throw new Error('Rendered option without matching placeId');
                }

                const matches = option.structured_formatting.main_text_matched_substrings || [];

                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                    <li key={key} {...optionProps}>
                        <div className="flex flex-row items-center justify-between gap-4">
                            <FaLocationArrow size={15} />
                            <div className="flex flex-col gap-1">
                                <span>
                                    {parts.map((part) => (
                                        <span className={clsx(part.highlight && 'font-bold')}>{part.text}</span>
                                    ))}
                                </span>
                                <span className="text-gray-400">
                                    {option.structured_formatting.secondary_text}
                                </span>
                            </div>
                        </div>
                    </li>
                );
            }}
        />
    );
}
