import { Children, useMemo } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';

export const GridLayout = ({ children }) => {
  const [
    StatCards,
    FilterArea,
    LineGraphArea,
    PieChartArea,
    StatsArea,
    MapArea,
    QRStatsArea,
  ] = Children.toArray(children) || [];

  const { templateAreas, gridTemplateColumns, gridTemplateRows } =
    useMemo(() => {
      const templateAreas = `
        "filterArea     filterArea   " 
        "statCards      statCards    "
        "statsArea      statsArea    "
        "lineGraphArea  pieChartArea "
        "qrStatsArea    qrStatsArea  "
        "mapArea        mapArea      "
        `;

      const gridTemplateRows = `auto auto 18rem auto 1fr`;
      const gridTemplateColumns = `2fr 1fr`;

      return { templateAreas, gridTemplateColumns, gridTemplateRows };
    }, []);

  return (
    <Grid
      templateAreas={templateAreas}
      gridTemplateRows={gridTemplateRows}
      gridTemplateColumns={gridTemplateColumns}
      minH={'100vh'}
      height={'fit-content'}
      width={'100%'}
      columnGap={'1rem'}
      rowGap={'1rem'}
      overflowX={'hidden'}
      overflowY={'auto'}
      p={1}
    >
      <GridItem area={'statCards'} width={'100%'}>
      <GridItem area={'filterArea'} width={'100%'}>
        {FilterArea}
      </GridItem>
        {StatCards}
      </GridItem>

      <GridItem area={'lineGraphArea'} minH={"30vh"} width={'100%'}>
        {LineGraphArea}
      </GridItem>

      <GridItem area={'pieChartArea'} minH={"30vh"} width={'100%'}>
        {PieChartArea}
      </GridItem>

      <GridItem area={'statsArea'} width={'100%'}>
        {StatsArea}
      </GridItem>

      <GridItem area={'mapArea'} width={'100%'}>
        {MapArea}
      </GridItem>

      <GridItem area={'qrStatsArea'} width={'100%'}>
        {QRStatsArea}
      </GridItem>
    </Grid>
  );
};

export default GridLayout;
