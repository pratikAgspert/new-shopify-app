import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { HStack, Tag, TagCloseButton } from '@chakra-ui/react';

export const AppliedFilterDisplay = ({
  appliedFilters = {},
  filterDisplayContainerStyles = {},
  filterTagStyles = {},
  removableFilters = false,
  updateAppliedFilters = null,
  onSearchIconClick = null,
  excludedFilterLabels = [],
  nonRemovableFilterLabels = [],
}) => {
  if (!appliedFilters || typeof appliedFilters !== 'object') return <></>;

  const excludedFilters = Array?.isArray(excludedFilterLabels)
    ? excludedFilterLabels
    : [];

  const filters =
    Object?.entries(appliedFilters)?.filter((entry) => {
      const [key, value] = entry;
      return !excludedFilters?.includes(key);
    }) ?? [];

  const filterCount = filters?.length;
  const suffix = filterCount > 1 ? 'Filters' : 'Filter';

  if (!filterCount) return <></>;

  const defaultTagStyles = {
    width: 'fit-content',
    colorScheme: 'yellow',
  };

  const userDataFields = ['user_id', 'user_name'];

  const removeFilter = (filterEntry) => {
    const [key, value] = filterEntry;

    if (userDataFields?.includes(key)) {
      const updatedFilters = filters?.reduce((updatedFilters, filterEntry) => {
        const [filterLabel, filterValue] = filterEntry;

        if (!userDataFields?.includes(filterLabel))
          updatedFilters[filterLabel] = filterValue;

        return updatedFilters;
      }, {});

      updateAppliedFilters?.(updatedFilters);
      return;
    }

    const updatedFilters = filters?.reduce((updatedFilters, filterEntry) => {
      const [filterLabel, filterValue] = filterEntry;
      if (key !== filterLabel) updatedFilters[filterLabel] = filterValue;

      return updatedFilters;
    }, {});

    updateAppliedFilters?.(updatedFilters);
  };

  const nonRemovableFilters = Array?.isArray(nonRemovableFilterLabels)
    ? nonRemovableFilterLabels
    : [];

  return (
    <>
      <HStack
        spacing={3}
        p={2}
        flexWrap={'wrap'}
        {...filterDisplayContainerStyles}
      >
        <Tag {...defaultTagStyles} textTransform={'uppercase'}>
          {`${filterCount} Applied ${suffix}`}
          <SearchIcon
            ml={1.5}
            boxSize={3}
            {...(onSearchIconClick && {
              cursor: 'pointer',
              onClick: (event) => {
                event?.stopPropagation();
                onSearchIconClick?.();
              },
            })}
          />
        </Tag>

        {filters?.map((filterEntry) => {
          const [key, value] = filterEntry;
          const filterLabel = key?.split('_')?.join(' ');

          return (
            <Tag
              {...defaultTagStyles}
              textTransform={'capitalize'}
              {...filterTagStyles}
            >
              {`${filterLabel} - ${value}`}

              {removableFilters && !nonRemovableFilters?.includes(key) && (
                <SmallCloseIcon
                  ml={2}
                  boxSize={5}
                  _hover={{ opacity: 0.8 }}
                  {...(updateAppliedFilters && {
                    cursor: 'pointer',
                    onClick: (event) => {
                      event?.stopPropagation();
                      removeFilter(filterEntry);
                    },
                  })}
                />
              )}
            </Tag>
          );
        })}
      </HStack>
    </>
  );
};

export default AppliedFilterDisplay;
