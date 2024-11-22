import React, { useContext } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ProductDriverContext } from "../../services/context";

const AddContentButton = ({ onAdd, sheetData, isDisabled }) => {
  const removeBrandBtn = sheetData?.some((btn) =>
    btn?.type?.includes("brand_banner")
  );

  const removeSocialBtn = sheetData?.some((btn) =>
    btn?.type?.includes("social_links")
  );
  const { driver } = useContext(ProductDriverContext);

  return (
    <Menu>
      <MenuButton
        className="add-story-content-btn"
        as={IconButton}
        aria-label="Add content"
        icon={<AddIcon />}
        colorScheme="teal"
        size="lg"
        isRound
        isDisabled={isDisabled}
      />
      <MenuList>
        <MenuItem
          className="add-360-image"
          onClick={() => {
            onAdd("carousel_360_image");
            setTimeout(() => {
              driver?.moveNext();
            }, 200);
          }}
          gap={2}
        >
          360° Image<Tag borderRadius={10}>Carousel</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("carousel_360_video")} gap={2}>
          360° Video<Tag borderRadius={10}>Carousel</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("carousel_2d_image")} gap={2}>
          2d Image<Tag borderRadius={10}>Carousel</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("carousel_2d_video")} gap={2}>
          2d Video<Tag borderRadius={10}>Carousel</Tag>
        </MenuItem>

        {!removeBrandBtn && (
          <MenuItem onClick={() => onAdd("brand_banner")} gap={2}>
            Banner <Tag borderRadius={10}>Sheet</Tag>
          </MenuItem>
        )}

        <MenuItem onClick={() => onAdd("content")} gap={2}>
          Text Content <Tag borderRadius={10}>Sheet</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("image_content")} gap={2}>
          2D Image <Tag borderRadius={10}>Sheet</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("video_content")} gap={2}>
          2D Video <Tag borderRadius={10}>Sheet</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("redirect_url")} gap={2}>
          Redirect Button <Tag borderRadius={10}>Sheet</Tag>
        </MenuItem>

        <MenuItem onClick={() => onAdd("partners")} gap={2}>
          Partners <Tag borderRadius={10}>Sheet</Tag>
        </MenuItem>

        {!removeSocialBtn && (
          <MenuItem onClick={() => onAdd("social_links")} gap={2}>
            Social Links <Tag borderRadius={10}>Sheet</Tag>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default AddContentButton;
