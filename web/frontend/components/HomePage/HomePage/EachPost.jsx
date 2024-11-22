import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';

import { useContext, useState } from 'react';
import { RiAccountCircleFill } from 'react-icons/ri';
import {
  BiCommentDetail,
  BiDotsVerticalRounded,
  BiEdit,
  BiTrash,
} from 'react-icons/bi';

import { queryClient } from '../..';
import { BASE_URL } from '../../services/baseURL';
import { AuthContext } from '../../services/context';
import { postBHD } from '../../services/networkRequest';

export const EachPost = ({ post }) => {
  const { text, pincodes, url } = post;

  return (
    <Flex
      direction={'column'}
      gap={3}
      px={4}
      py={3}
      borderRadius={'md'}
      boxShadow={'0.5px 0.5px 3px 0 gray'}
    >
      <ProfileContainer post={post} />

      {pincodes?.length > 0 && (
        <HStack p={1} spacing={3} flexWrap={'wrap'}>
          <Tag size={'md'} variant={'subtle'} colorScheme="green">
            {pincodes.length > 1 ? 'Pincodes -' : `Pincode - ${pincodes[0]}`}
          </Tag>

          {pincodes.length > 1 &&
            pincodes.map((pincode) => (
              <Tag
                size={'md'}
                key={pincode}
                variant="subtle"
                colorScheme="whatsapp"
              >
                {pincode}
              </Tag>
            ))}
        </HStack>
      )}

      {text?.length > 0 && (
        <Text
          textAlign={{ base: 'center', sm: 'left' }}
          my={2}
          p={1}
          fontWeight={'400'}
          fontSize={{ base: 'medium', md: 'large' }}
        >
          {text}
        </Text>
      )}

      {url?.length > 0 && (
        <Image
          alignSelf={'center'}
          my={3}
          height={'min(100%,20rem)'}
          width={'min(100%,20rem)'}
          objectPosition={'center'}
          objectFit={'cover'}
          src={url}
          alt="post image"
        />
      )}

      <CommentActionContainer post={post} />
    </Flex>
  );
};

const ProfileContainer = ({ post }) => {
  const iconColor = '#00b894';

  return (
    <Flex
      flex="1"
      gap="5"
      alignItems="center"
      justifyContent={'space-between'}
      flexWrap="wrap"
    >
      <Flex alignItems={'center'} justifyContent={'space-between'} gap={3}>
        <RiAccountCircleFill size={50} color={iconColor} />

        <Box>
          <Text mb={0} fontSize={'large'} fontWeight={600}>
            {post.user_name}
          </Text>
          <Text mb={0} fontSize={'small'}>
            {post.date}
          </Text>
        </Box>
      </Flex>

      <PostActionContainer post={post} />
    </Flex>
  );
};

const PostActionContainer = ({ post }) => {
  const iconColor = '#00b894';
  const { getToken } = useContext(AuthContext);
  const toast = useToast({ position: 'top', duration: 2000 });

  const onDelete = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete the post ?'
    );

    if (confirmation) {
      const deletePostPromise = postBHD(
        BASE_URL + 'kvk/archive_post/',
        getToken(),
        {
          post_id: post.id,
        }
      ).then((data) => {
        if (data.status === 'true') queryClient.invalidateQueries(['posts']);
      });

      toast.promise(deletePostPromise, {
        success: {
          title: 'Deletion Successful!',
          description: 'The posts have been updated',
        },
        error: { title: 'OOPS!', description: 'Something went wrong!' },
        loading: {
          title: 'Work In Progress',
          description: 'Good things come to those who wait :)',
        },
      });
    }
  };

  const onShare = () => {
    const tocopy = BASE_URL + 'main/to_app/' + post.postID;
    if (navigator.clipboard !== undefined) {
      const clipboardPromise = navigator.clipboard.writeText(tocopy);

      toast.promise(clipboardPromise, {
        success: {
          title: 'Successful!',
          description: 'The post has been copied on the clipboard.',
        },
        error: { title: 'OOPS!', description: 'Something went wrong!' },
        loading: {
          title: 'Work In Progress',
          description: 'Good things come to those who wait :)',
        },
      });
    } else {
      toast({
        status: 'error',
        title: 'OOPS',
        description:
          'Could not copy the post on clipboard. Please use desktop. ',
      });
    }
  };

  return (
    <>
      <Menu placement="left-start">
        <MenuButton
          as={IconButton}
          aria-label="Post Actions"
          icon={<BiDotsVerticalRounded size={'30'} color={iconColor} />}
          variant="ghost"
          width={'fit-content'}
        />
        <MenuList>
          <MenuItem
            fontSize={'large'}
            icon={<BiTrash color={'gray'} size={'20'} />}
            onClick={() => onDelete()}
          >
            Delete Post
          </MenuItem>
          <MenuItem
            fontSize={'large'}
            icon={<BiEdit color={'gray'} size={'20'} />}
            onClick={() => onShare()}
          >
            Share Post
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

const CommentActionContainer = ({ post }) => {
  const { comments, farmers } = post;
  const [commentsAreVisible, setCommentsAreVisible] = useState(false);

  const totalComments = comments?.length ?? 0;
  const totalFarmers = farmers?.length ?? 0;

  return (
    <>
      <Flex p={1} justifyContent={'space-between'} alignItems={'center'}>
        {totalComments > 0 && (
          <Button
            leftIcon={<BiCommentDetail />}
            colorScheme="gray"
            variant={'solid'}
            size={'sm'}
            onClick={() => setCommentsAreVisible(!commentsAreVisible)}
          >
            {commentsAreVisible ? 'Hide Comments' : 'Show Comments'}
          </Button>
        )}
        {totalComments === 0 && (
          <Button
            leftIcon={<BiCommentDetail />}
            colorScheme="gray"
            variant={'solid'}
            disabled
            size={'sm'}
          >
            No Comments
          </Button>
        )}
        {totalFarmers > 0 && (
          <Text fontSize={'medium'} fontWeight={'500'} mb={0}>
            {farmers[0]} {totalFarmers > 1 && `+ ${totalFarmers - 1} Others`}
          </Text>
        )}
      </Flex>

      {totalComments > 0 && commentsAreVisible && (
        <CommentDisplayContainer comments={comments} />
      )}
    </>
  );
};

const CommentDisplayContainer = ({ comments }) => {
  return (
    <Flex
      borderRadius={'md'}
      boxShadow={'0 0 3px 0 #12121240 inset'}
      px={4}
      py={5}
      gap={3}
      direction={'column'}
      mt={3}
    >
      {comments.map((comment) => (
        <Comment key={comment.text} comment={comment} />
      ))}
    </Flex>
  );
};

const Comment = ({ comment }) => {
  const { farmer, farmer_pin: pincode, text } = comment;

  return (
    <Flex
      p={3}
      background={'#E2E8F0'}
      direction={'column'}
      gap={2}
      flexGrow={1}
      borderRadius={'xl'}
      borderTopLeftRadius={'0'}
    >
      <HStack spacing={2}>
        <RiAccountCircleFill size={'30'} color="#12121290" />
        <HStack alignItems={'center'} spacing={1} fontWeight={'500'}>
          <Text fontSize={'md'} mb={0}>
            {farmer}
          </Text>

          {pincode && (
            <Text fontSize={'sm'} mb={0}>
              {` | `}
              {pincode}
            </Text>
          )}
        </HStack>
      </HStack>
      <Text px={1} fontSize={'medium'} mb={0}>
        {text}
      </Text>
    </Flex>
  );
};
