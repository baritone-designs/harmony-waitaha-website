import { useState, useRef, useMemo, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import { FaLocationArrow } from 'react-icons/fa';
import clsx from 'clsx';

interface LocationAutocompleteProps {
    name: string;
    label: string;
}

// TODO: Make this work
export default function LocationAutocomplete({ name, label }: LocationAutocompleteProps) {
    const [value, setValue] = useState<google.maps.places.AutocompletePrediction | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<readonly google.maps.places.AutocompletePrediction[]>([]);
    const autocompleteService = useRef(new google.maps.places.AutocompleteService());

    const fetch = useMemo(
        () => debounce(
            (
                request: { input: string },
                callback: (results: readonly google.maps.places.AutocompletePrediction[] | null) => void,
            ) => {
                autocompleteService.current.getPlacePredictions(
                    request,
                    callback,
                );
            },
            400,
        ),
        [],
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly google.maps.places.AutocompletePrediction[] | null) => {
            if (active && results !== null) {
                let newOptions: readonly google.maps.places.AutocompletePrediction[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No locations"
            onChange={(_e, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(_e, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Venue" fullWidth />
            )}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const matches = option.structured_formatting.main_text_matched_substrings || [];

                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match: any) => [match.offset, match.offset + match.length]),
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
