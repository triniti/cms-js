# Triniti CMS Utils

## humanizeEnums

This function transforms a triniti Enum to a human readable format, configuration available.
 * enumObj - required. The triniti Enum class
 * config - Object, the configuration object
    - format - string, the output format, can be either `value` or `map`. Default: value,
    - except - array, an array of enumObj options that will be excluded from output.
    - only - array, an array of enumObj options that will be output exclusively. **Note**: when `only` property is not empty, 
    it will take precedence over `except` property.
    - labelKey - string, customize the output label key when format is `map`. Will be ignored when format is NOT `map`. Default: label
    - valueKey - string, customize the output value key when format is `map`. Will be ignored when format is NOT `map`. Default: value

### How to use
```jsx harmony
import humanizeEnums from 'path-to-utils';
import SearchSortEnum from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';

const output = humanizeEnums(SearchSortEnum, { except: [SearchSortEnum.UNKNOWN] });
const mapOutput = humanizeEnums(SearchSortEnum, { format: 'map', only: [SearchSortEnum.PUBLISHED, SearchSortEnum.DELETED] });
```

