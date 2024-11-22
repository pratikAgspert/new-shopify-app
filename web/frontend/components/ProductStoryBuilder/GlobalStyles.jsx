import React, { useState, useRef, useContext, useMemo } from "react";
import {
  Box,
  HStack,
  Text,
  Select,
  Stack,
  ButtonGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  RadioGroup,
  Radio,
  Grid,
  GridItem,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from "react-icons/md";
import SheetBgIcon from "../../assets/Icon/SheetBgIcon";
import SheetHandleIcon from "../../assets/Icon/SheetHandleIcon";
import { ProductStoryContext } from "../../services/context";

const GlobalStyles = () => {
  return (
    <Stack>
      <SheetColor />

      <FontFamily />

      <LineHeight />

      {/* <TextStyles isDisabled={isDisabled} onUpdate={onUpdate} {...content} /> */}

      {/* <ContainerStyles
        isDisabled={isDisabled}
        onUpdate={onUpdate}
        {...content}
      /> */}
    </Stack>
  );
};

const SheetColor = () => {
  const colorSheetInputRef = useRef(null);
  const colorHandleInputRef = useRef(null);

  const { isDisabled, styles, handleStyleChange } =
    useContext(ProductStoryContext);

  console.log("globalStyles=>globalStyles", styles);

  const handleSheetColorChange = (e) => {
    handleStyleChange({ background_color: e?.target?.value });
  };

  const handleSheetHandleColorChange = (e) => {
    handleStyleChange({ handle_color: e.target.value });
  };

  const handleSheetTagClick = () => {
    if (!isDisabled && colorSheetInputRef.current) {
      colorSheetInputRef.current.click();
    }
  };

  const handleDragHandleTagClick = () => {
    if (!isDisabled && colorHandleInputRef.current) {
      colorHandleInputRef.current.click();
    }
  };

  return (
    <Stack pb={0}>
      <Text mb={0}>Choose Color:</Text>
      <HStack gap={3}>
        <Stack onClick={handleSheetTagClick}>
          <SheetBgIcon selectedColor={styles?.background_color} />

          <input
            ref={colorSheetInputRef}
            type="color"
            value={styles?.background_color}
            style={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: 100,
              borderColor: styles?.background_color,
              cursor: isDisabled ? "no-drop" : "pointer",
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
            }}
            disabled={isDisabled}
            onChange={handleSheetColorChange}
          />
        </Stack>

        <Stack
          onClick={handleDragHandleTagClick}
          cursor={isDisabled ? "no-drop" : "pointer"}
        >
          <SheetHandleIcon selectedColor={styles?.handle_color} />

          <input
            ref={colorHandleInputRef}
            type="color"
            value={styles?.handle_color}
            style={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: 100,
              borderColor: styles?.handle_color,
              cursor: isDisabled ? "no-drop" : "pointer",
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
            }}
            disabled={isDisabled}
            onChange={handleSheetHandleColorChange}
          />
        </Stack>
      </HStack>
    </Stack>
  );
};

const FontFamily = () => {
  const fontOptions = [
    "Open Sans",
    "Roboto",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Noto Sans",
    "Ubuntu",
    "Playfair Display",
    "Merriweather",
    "Source Sans Pro",
    "Oswald",
    "Nunito",
    "Quicksand",
    "Rubik",
    "Work Sans",
    "Inter",
    "Fira Sans",
    "PT Sans",
    "Mukta",
    "Noto Serif",
    "Titillium Web",
    "Inconsolata",
    "Roboto Condensed",
    "Roboto Mono",
    "Lora",
    "Karla",
    "Cabin",
    "Arimo",
    "Libre Franklin",
  ];

  const { isDisabled, styles, handleStyleChange } =
    useContext(ProductStoryContext);

  const [searchInput, setSearchInput] = useState("");
  const [focused, setFocused] = useState(false);

  const filteredOptions = useMemo(() => {
    return fontOptions.filter((font) =>
      font.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput]);

  const handleFontChange = (font) => {
    handleStyleChange({ font_family: font });
    setSearchInput(font);
    setFocused(false);
  };

  return (
    <Stack spacing={1}>
      <Text mb={0} w={"fit-content"}>
        Font Family:
      </Text>

      <Box position="relative">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search font..."
          isDisabled={isDisabled}
          fontFamily={styles?.font_family}
        />

        {focused && (
          <List
            position="absolute"
            top="100%"
            width="100%"
            bg="white"
            boxShadow="md"
            maxHeight="200px"
            overflowY="auto"
            zIndex={1}
            borderRadius="md"
            pl={0}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((font) => (
                <ListItem
                  key={font}
                  onClick={() => handleFontChange(font)}
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                >
                  <Text
                    fontFamily={font}
                    mb={0}
                    p={3}
                    _hover={{ color: "#00B894" }}
                  >
                    {font}
                  </Text>
                </ListItem>
              ))
            ) : (
              <ListItem p={2}>
                <Text color="gray.500">No fonts found</Text>
              </ListItem>
            )}
          </List>
        )}
      </Box>
    </Stack>
  );
};

const LineHeight = () => {
  const { isDisabled, styles, handleStyleChange } =
    useContext(ProductStoryContext);

  const handleLineHeightChange = (value) => {
    handleStyleChange({ lineHeight: value });
  };

  return (
    <Stack spacing={3}>
      <Text mb={0}>Line Height:</Text>

      <Stack spacing={0} px={3}>
        <Slider
          aria-label="line-height-slider"
          defaultValue={1.5}
          min={1}
          max={2.5}
          step={0.1}
          isDisabled={isDisabled}
          value={styles?.lineHeight}
          onChange={handleLineHeightChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <Text fontSize="xs" textAlign="right" color="gray.600" mb={0}>
          {styles?.lineHeight?.toFixed(1)}
        </Text>
      </Stack>
    </Stack>
  );
};

const TextStyles = () => {
  const [textAlign, setTextAlign] = useState("left");
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const { isDisabled, styles, handleStyleChange } =
    useContext(ProductStoryContext);

  const handleAlignChange = (alignment) => {
    setTextAlign(alignment);
    // onUpdate({ text_align: alignment });
  };

  const handleStyleChanges = (style) => {
    const newStyles = { ...textStyle, [style]: !textStyle[style] };
    setTextStyle(newStyles);
    // onUpdate({ text_styles: newStyles });
  };

  return (
    <Stack
      spacing={1}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      borderColor="gray.200"
    >
      <Text fontSize="lg" fontWeight="medium">
        Text Styling:
      </Text>

      {/* Text Alignment */}
      <Stack spacing={2}>
        <Text fontSize="sm">Alignment:</Text>
        <ButtonGroup size="sm" isAttached variant="outline" width="full">
          <Tooltip label="Align Left">
            <IconButton
              icon={<MdFormatAlignLeft />}
              isActive={textAlign === "left"}
              onClick={() => handleAlignChange("left")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
          <Tooltip label="Align Center">
            <IconButton
              icon={<MdFormatAlignCenter />}
              isActive={textAlign === "center"}
              onClick={() => handleAlignChange("center")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
          <Tooltip label="Align Right">
            <IconButton
              icon={<MdFormatAlignRight />}
              isActive={textAlign === "right"}
              onClick={() => handleAlignChange("right")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
          <Tooltip label="Justify">
            <IconButton
              icon={<MdFormatAlignJustify />}
              isActive={textAlign === "justify"}
              onClick={() => handleAlignChange("justify")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
        </ButtonGroup>
      </Stack>

      {/* Text Style Buttons */}
      <Stack spacing={2}>
        <Text fontSize="sm">Style:</Text>
        <ButtonGroup size="sm" isAttached variant="outline" width="full">
          <Tooltip label="Bold">
            <IconButton
              icon={<MdFormatBold />}
              isActive={textStyle.bold}
              onClick={() => handleStyleChanges("bold")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
          <Tooltip label="Italic">
            <IconButton
              icon={<MdFormatItalic />}
              isActive={textStyle.italic}
              onClick={() => handleStyleChanges("italic")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
          <Tooltip label="Underline">
            <IconButton
              icon={<MdFormatUnderlined />}
              isActive={textStyle.underline}
              onClick={() => handleStyleChanges("underline")}
              isDisabled={isDisabled}
              flex={1}
            />
          </Tooltip>
        </ButtonGroup>
      </Stack>

      {/* Preview Box */}
      <Box
        borderWidth={1}
        borderRadius="md"
        p={4}
        mt={2}
        borderColor="gray.200"
        style={{
          textAlign: textAlign,
          fontWeight: textStyle.bold ? "bold" : "normal",
          fontStyle: textStyle.italic ? "italic" : "normal",
          textDecoration: textStyle.underline ? "underline" : "none",
        }}
      >
        Example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Box>
    </Stack>
  );
};

const ContainerStyles = () => {
  const [containerStyles, setContainerStyles] = useState({
    padding: {
      top: 16,
      right: 16,
      bottom: 16,
      left: 16,
    },
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    border: {
      width: 1,
      radius: 4,
      style: "solid",
      color: "#E2E8F0",
    },
    background: {
      type: "color",
      color: "#FFFFFF",
      opacity: 100,
    },
  });

  const { isDisabled, styles, handleStyleChange } =
    useContext(ProductStoryContext);

  const handleStyleUpdate = (category, property, value) => {
    const newStyles = {
      ...containerStyles,
      [category]: {
        ...containerStyles[category],
        [property]: value,
      },
    };
    setContainerStyles(newStyles);
    // onUpdate({ container_styles: newStyles });
  };

  return (
    <Stack
      spacing={4}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      borderColor="gray.200"
    >
      <Text fontSize="lg" fontWeight="medium">
        Container Styles:
      </Text>

      <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
        <TabList>
          <Tab>Spacing</Tab>
          <Tab>Border</Tab>
          <Tab>Background</Tab>
        </TabList>

        <TabPanels>
          {/* Spacing Panel */}
          <TabPanel>
            <Stack spacing={4}>
              {/* Padding Controls */}
              <Box>
                <Text fontSize="sm" mb={2}>
                  Padding (px):
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {["top", "right", "bottom", "left"].map((side) => (
                    <GridItem key={`padding-${side}`}>
                      <HStack>
                        <Text fontSize="xs" width="60px">
                          {side}:
                        </Text>
                        <NumberInput
                          size="sm"
                          min={0}
                          max={100}
                          value={containerStyles.padding[side]}
                          onChange={(value) =>
                            handleStyleUpdate("padding", side, parseInt(value))
                          }
                          isDisabled={isDisabled}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </HStack>
                    </GridItem>
                  ))}
                </Grid>
              </Box>

              {/* Margin Controls */}
              <Box>
                <Text fontSize="sm" mb={2}>
                  Margin (px):
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {["top", "right", "bottom", "left"].map((side) => (
                    <GridItem key={`margin-${side}`}>
                      <HStack>
                        <Text fontSize="xs" width="60px">
                          {side}:
                        </Text>
                        <NumberInput
                          size="sm"
                          min={0}
                          max={100}
                          value={containerStyles.margin[side]}
                          onChange={(value) =>
                            handleStyleUpdate("margin", side, parseInt(value))
                          }
                          isDisabled={isDisabled}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </HStack>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </Stack>
          </TabPanel>

          {/* Border Panel */}
          <TabPanel>
            <Stack spacing={4}>
              <HStack>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2}>
                    Border Width:
                  </Text>
                  <NumberInput
                    size="sm"
                    min={0}
                    max={10}
                    value={containerStyles.border.width}
                    onChange={(value) =>
                      handleStyleUpdate("border", "width", parseInt(value))
                    }
                    isDisabled={isDisabled}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2}>
                    Border Radius:
                  </Text>
                  <NumberInput
                    size="sm"
                    min={0}
                    max={50}
                    value={containerStyles.border.radius}
                    onChange={(value) =>
                      handleStyleUpdate("border", "radius", parseInt(value))
                    }
                    isDisabled={isDisabled}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" mb={2}>
                  Border Style:
                </Text>
                <RadioGroup
                  value={containerStyles.border.style}
                  onChange={(value) =>
                    handleStyleUpdate("border", "style", value)
                  }
                  isDisabled={isDisabled}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="solid">Solid</Radio>
                    <Radio value="dashed">Dashed</Radio>
                    <Radio value="dotted">Dotted</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Box>
                <Text fontSize="sm" mb={2}>
                  Border Color:
                </Text>
                <input
                  type="color"
                  value={containerStyles.border.color}
                  onChange={(e) =>
                    handleStyleUpdate("border", "color", e.target.value)
                  }
                  disabled={isDisabled}
                  style={{ width: "100%", height: "30px" }}
                />
              </Box>
            </Stack>
          </TabPanel>

          {/* Background Panel */}
          <TabPanel>
            <Stack spacing={4}>
              <Box>
                <Text fontSize="sm" mb={2}>
                  Background Type:
                </Text>
                <RadioGroup
                  value={containerStyles.background.type}
                  onChange={(value) =>
                    handleStyleUpdate("background", "type", value)
                  }
                  isDisabled={isDisabled}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="color">Color</Radio>
                    <Radio value="transparent">Transparent</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              {containerStyles.background.type === "color" && (
                <>
                  <Box>
                    <Text fontSize="sm" mb={2}>
                      Background Color:
                    </Text>
                    <input
                      type="color"
                      value={containerStyles.background.color}
                      onChange={(e) =>
                        handleStyleUpdate("background", "color", e.target.value)
                      }
                      disabled={isDisabled}
                      style={{ width: "100%", height: "30px" }}
                    />
                  </Box>

                  <Box>
                    <Text fontSize="sm" mb={2}>
                      Opacity: {containerStyles.background.opacity}%
                    </Text>
                    <Slider
                      value={containerStyles.background.opacity}
                      onChange={(value) =>
                        handleStyleUpdate("background", "opacity", value)
                      }
                      min={0}
                      max={100}
                      step={1}
                      isDisabled={isDisabled}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                </>
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Preview Box */}
      <Box mt={4}>
        <Text fontSize="sm" mb={2}>
          Preview:
        </Text>
        <Box
          style={{
            padding: `${containerStyles.padding.top}px ${containerStyles.padding.right}px ${containerStyles.padding.bottom}px ${containerStyles.padding.left}px`,
            margin: `${containerStyles.margin.top}px ${containerStyles.margin.right}px ${containerStyles.margin.bottom}px ${containerStyles.margin.left}px`,
            borderWidth: `${containerStyles.border.width}px`,
            borderStyle: containerStyles.border.style,
            borderColor: containerStyles.border.color,
            borderRadius: `${containerStyles.border.radius}px`,
            backgroundColor:
              containerStyles.background.type === "transparent"
                ? "transparent"
                : containerStyles.background.color,
            opacity: containerStyles.background.opacity / 100,
          }}
          border="1px dashed gray"
        >
          <Text>Container Preview</Text>
        </Box>
      </Box>
    </Stack>
  );
};

export default GlobalStyles;
