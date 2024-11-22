import {
  IconButton,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Button,
  Code,
  Badge,
  useToast,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { TbSeo } from "react-icons/tb";
import { CopyIcon } from "@chakra-ui/icons";
import { SparkleIcon } from "../../assets/Icon/sparkel";

function extractSeoInfo(jsonData) {
  const seoData = {
    title: "",
    description: "",
    keywords: [],
    headers: [],
    content: [],
    infoPoints: [],
  };

  // Process carousel data
  if (jsonData.data && Array.isArray(jsonData.data)) {
    jsonData.data.forEach((item) => {
      if (item.header) {
        seoData.headers.push(item.header);
      }

      // Extract info points
      if (item.infoPoints) {
        Object.values(item.infoPoints).forEach((point) => {
          if (point.text) {
            seoData.infoPoints.push(point.text);
          }
        });
      }
    });
  }

  // Process general sheet data
  if (jsonData.general_sheet && Array.isArray(jsonData.general_sheet)) {
    jsonData.general_sheet.forEach((item) => {
      // Extract content
      if (item.type === "content" && item.content) {
        // Remove HTML tags and clean up the text
        const cleanContent = item.content
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        seoData.content.push(cleanContent);
      }
    });
  }

  // Generate default SEO content
  seoData.title = seoData.headers[0] || "Tea Processing and Production";
  seoData.description =
    seoData.content[0]?.substring(0, 160) ||
    "Learn about our organic tea processing and production methods.";
  seoData.keywords = [
    ...new Set([
      ...seoData.headers,
      "tea",
      "organic tea",
      "tea processing",
      "tea production",
      "sustainable tea",
    ]),
  ].filter(Boolean);

  return seoData;
}

const jsonData = {
  data: [
    {
      id: "39v3l91Gal-QD_psS4SNs",
      data: [
        {
          id: "_9n1jFqnY3DLWkgKmhKmY",
          type: "carousel_360_image",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/emrmvjbirdcmqapyvnbmbrimfbxohg",
        },
      ],
      type: "carousel_360_image",
      header: "Tea Farm",
      isActive: true,
      infoPoints: {
        "vOIPIEk-tNRuipWoIlIty": {
          id: "vOIPIEk-tNRuipWoIlIty",
          text: "Grown organically without chemicals, our tea is produced sustainably using renewable energy to minimize our environmental impact.",
          coords: {
            x: -0.03934880519327426,
            y: 0.041571103960693086,
            z: -0.9977908311604566,
          },
        },
      },
    },
    {
      id: "bX3FydyArndkeg1NNWvRE",
      data: [
        {
          id: "SuLVuxzRiWhM2fShaGmBg",
          type: "carousel_360_video",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/jjbdhpmfoxavzzzpaligtuvbzfmdjj",
        },
      ],
      type: "carousel_360_video",
      header: "Tea leaves drying process",
      isActive: true,
      infoPoints: {
        "01OpNwzLdkwTX1xHnoZYA": {
          id: "01OpNwzLdkwTX1xHnoZYA",
          text: "Unlike mass-produced teas, our small batches undergo a traditional withering process. This careful drying enhances the tea's natural flavor.",
          coords: {
            x: -0.03937074609610536,
            y: 0.026415193337203078,
            z: -0.9983477571577631,
          },
        },
      },
    },
    {
      id: "rY1Gk4if9AlO81AjNa-Jv",
      data: [
        {
          id: "JOxbtsNAKSzlL61XV88Mc",
          type: "carousel_2d_image",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/rrpgmgvuykqlmdccrvpnrbmtwlodra",
        },
      ],
      type: "carousel_2d_image",
      header: "Packaging Tea bags",
      isActive: true,
      infoPoints: {},
    },
    {
      id: "ZJS4xoFPasP3WoYjxKgwr",
      data: [
        {
          id: "TdYntuwSg6skaKbQDFZ3G",
          type: "carousel_2d_video",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/kmfbfypoaabtsctpprrgvcupmilyko",
        },
      ],
      type: "carousel_2d_video",
      header: "Packaging Tea bags video",
      isActive: true,
      infoPoints: {},
    },
  ],
  general_sheet: [
    {
      id: "unHxnBDYlz8O7eMACkuL8",
      data: [
        {
          id: "705pRbt5eIb4wj9XQ0t2D",
          type: "brand_banner",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/etrcikwtilzondmncdwyptsvzkeojc",
        },
      ],
      type: "brand_banner",
      header: "",
      isActive: true,
    },
    {
      id: "aI_GqSzTcA8-dw3YqtGZt",
      data: [],
      type: "content",
      header: "",
      content:
        "<p>Tea processing involves various steps to transform fresh tea leaves into the final product. The key steps include:</p><p><strong>1. Plucking:</strong> Fresh tea leaves are carefully hand-picked from the tea bushes.</p><p><strong>2. Withering:</strong> The plucked leaves are spread out to lose moisture and become pliable.</p><p><strong>3. Rolling/Twisting:</strong> The withered leaves are rolled or twisted to break open the cell walls, releasing enzymes.</p><p><strong>4. Oxidation (Fermentation):</strong> For black tea, the leaves are exposed to oxygen, causing them to oxidize and turn brown. This step is skipped for green and white teas.</p><p><strong>5. Fixing:</strong> The oxidation process is halted by heating the leaves, either by steaming or pan-firing.</p><p><strong>6. Drying:</strong> The leaves are dried to remove excess moisture and preserve the final product.</p><p><strong>7. Sorting and Grading:</strong> The dried tea is sorted and graded based on leaf size, color, and quality.</p><p><strong>8. Packaging:</strong> The graded tea is packaged for distribution and sale.</p><p>The specific processing methods and duration vary depending on the type of tea being produced, resulting in different flavors and characteristics.</p>",
      isActive: true,
    },
    {
      id: "a40NkohslgDxoRNxFWQEM",
      url: "https://woolah.agspeak.in/",
      data: [],
      type: "redirect_url",
      label: "Buy Product",
      header: "",
      isActive: true,
    },
    {
      id: "tTqxSYdKeUXwhg-A4p53D",
      data: [
        {
          id: "YvyJx2yCneqitG4wkDHGe",
          type: "partners",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/dvqlbocxzfqefoeupdlxgtmgxdldrj",
        },
        {
          id: "h66S4jxHNZUa_PWGzx51v",
          type: "partners",
          image_url:
            "https://agspert-weatherstation1.s3.amazonaws.com/media/1079/uluckiybfoifdkmbbekyclxoyocchz",
        },
      ],
      type: "partners",
      header: "",
      isActive: true,
    },
    {
      id: "2MOUo1zD18sWi2tDTbT-G",
      data: [],
      type: "social_links",
      header: "",
      isActive: true,
      social_links: [
        {
          id: "-RyKqB0DB8v6GM1-630Zp",
          url: "https://www.youtube.com/@woolahtea",
          label: "youtube",
        },
        {
          id: "cTjYBwVW4WSh26dJsluT6",
          url: "https://www.facebook.com/WoolahTea/",
          label: "facebook",
        },
        {
          id: "ZoSSO48P3gcq0C7Db0Y4Z",
          url: "https://www.instagram.com/be_woolah/",
          label: "instagram",
        },
      ],
    },
    {
      id: "cyXRPIj8eICz6fW-TR5Bz",
      data: [],
      type: "content",
      header: "",
      content:
        "<p><strong>What makes the tea box in your hand so special?</strong></p><p>Woolah TrueDips is nothing like you have ever tasted or experienced. Woolah TrueDips is the World's First Bagless Tea, which in the shape of a tablet locks in the most authentic and exotic Assam tea flavors you have ever tasted.</p><p><strong>'Source transparency' for you, the consumer:</strong></p><p>In the heart of Woolah is a meticulously curated value chain which provides gainful earning sources to organically grown micro tea farm owners, tea workers, packaging specialists. It has also delegated women workers to participate and earn a livelihood for themselves. Woolah also contributes towards funding quality education for the children of tea workers. The idea is to empower our smallholder tea growers with more visibility, while keeping our sourcing 100% transparent for our consumers!</p>",
      isActive: true,
    },
    {
      id: "Hjvu3kTJ2qXhiOjc3fthY",
      data: [],
      type: "global_style",
      header: "",
      isActive: true,
      lineHeight: 1,
      font_family: "Poppins",
      handle_color: "#808080",
      background_color: "#ffffff",
    },
  ],
  is_general_sheet: true,
};

const SeoEditor = ({ content }) => {
  const [seoContent, setSeoContent] = useState({
    title: "",
    description: "",
    keywords: "",
    additionalTags: "",
  });

  const toast = useToast();

  useEffect(() => {
    if (jsonData) {
      const extractedSeo = extractSeoInfo(jsonData);
      setSeoContent({
        title: extractedSeo.title,
        description: extractedSeo.description,
        keywords: extractedSeo.keywords.join(", "),
        additionalTags: generateAdditionalTags(extractedSeo),
      });
    }
  }, [jsonData]);

  const generateAdditionalTags = (seoData) => {
    return `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${seoData.title}">
<meta property="og:description" content="${seoData.description}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${seoData.title}">
<meta name="twitter:description" content="${seoData.description}">
    `.trim();
  };

  const handleInputChange = (field, value) => {
    setSeoContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateMetaTags = () => {
    return `
<!-- Primary Meta Tags -->
<title>${seoContent.title}</title>
<meta name="title" content="${seoContent.title}">
<meta name="description" content="${seoContent.description}">
<meta name="keywords" content="${seoContent.keywords}">

${seoContent.additionalTags}
    `.trim();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTags());
      toast({
        title: "Copied to clipboard!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const modalMethods = useDisclosure();
  const { isOpen, onOpen, onClose } = modalMethods;

  return (
    <>
      <IconButton
        icon={<TbSeo />}
        rounded={"full"}
        fontSize={24}
        w={12}
        h={12}
        colorScheme="blue"
        onClick={onOpen}
      />
      <SeoModal
        modalMethods={modalMethods}
        header={
          <HStack>
            <Text mb={0}>SEO Editor</Text>

            <Button
              borderRadius={"100%"}
              p={0}
              // _hover={{ boxShadow: '0 0 3px 0 blue' }}
              cursor={"pointer"}
              backgroundColor={"transparent"}
            >
              <SparkleIcon width={"20px"} height={"20px"} fill={"blue"} />
            </Button>
          </HStack>
        }
        footer={
          <Button
            onClick={copyToClipboard}
            leftIcon={<CopyIcon />}
            colorScheme="blue"
            size="sm"
            alignSelf="flex-end"
          >
            Copy Meta Tags
          </Button>
        }
      >
        <Stack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Meta Title</FormLabel>
            <Textarea
              value={seoContent.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter meta title"
              size="sm"
              rows={2}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              Meta Description
              <Badge
                ml={2}
                // colorScheme={
                //   seoContent.description.length > 160 ? 'red' : 'green'
                // }
              >
                {/* {seoContent.description.length}/160 */}
                {seoContent.description.length}
              </Badge>
            </FormLabel>
            <Textarea
              value={seoContent.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter meta description"
              size="sm"
              rows={3}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Keywords</FormLabel>
            <Textarea
              value={seoContent.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="Enter keywords, separated by commas"
              size="sm"
              rows={2}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Additional Meta Tags</FormLabel>
            <Textarea
              value={seoContent.additionalTags}
              onChange={(e) =>
                handleInputChange("additionalTags", e.target.value)
              }
              placeholder="Additional meta tags"
              size="sm"
              rows={6}
              fontFamily="mono"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Generated Meta Tags</FormLabel>
            <Code
              display="block"
              whiteSpace="pre"
              p={4}
              borderRadius="md"
              fontSize="sm"
              overflow="auto"
              maxHeight="200px"
            >
              {generateMetaTags()}
            </Code>
          </FormControl>
        </Stack>
      </SeoModal>
    </>
  );
};

const SeoModal = ({ children, modalMethods, footer, header }) => {
  const { isOpen, onOpen, onClose } = modalMethods;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader alignSelf={"center"}>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SeoEditor;
