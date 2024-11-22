export async function postData(url, data) {
  // Default options are marked with *

  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    // this post request is returning 200 on success
    if (response.status !== 200) {
      const body = await response.json();
      throw new Error(body.detail[0]);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    console.log('postData Error', err);
    throw new Error(err.message);
  }
}

// name is very misleading have to change it
export async function getHeaderData(url, data) {
  // Default options are marked with *
  try {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': data,
      },
    });
    if (response.status !== 200) {
      const res = await response.json();
      throw new Error(`${res.detail}`);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function postBHD(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    // it is sending status code 200
    if (response.status !== 200 && response.status !== 201) {
      const res = await response.json();
      console.log('response', res);
      throw new Error(res.detail ? res.detail : 'something went wrong');
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    console.log('postBHD Error', err);
    throw new Error(err.message);
  }
}

export async function patchBHD(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response.status !== 200) {
      console.log('pathcBHD Error', response);
      throw new Error('Request Failed. Try Again!!');
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    console.log('patchBHD Error', err);
    throw new Error('Request Failed. Try Again!!');
  }
}

export async function getBHD(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response.status !== 200) {
      const res = await response.json();
      throw new Error(res.detail);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function putBHD(url, token, data) {
  // Default options are marked with *
  // console.log(token)
  // console.log(JSON.stringify(data))
  try {
    const response = await fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response.status !== 200) {
      const res = await response.json();
      throw new Error(res.detail);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function checkToken(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'OPTIONS', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      'Authorization': data,
    },
    body: '', // body data type must match "Content-Type" header
  });
  if (response.ok) {
    return response.json(); // parses JSON response into native JavaScript objects
  } else {
    throw new Error('invalid token');
  }
}

export async function postImages(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: data,
    });
    console.log(typeof response);
    if (response.status !== 201) {
      const res = response.json();
      const detail = res.detail ? res.detail : res.image[0];
      throw new Error(detail);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function postImagesTest(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: data,
    });
    console.log(typeof response);
    if (response.status !== 201) {
      const res = await response.json();
      const detail = res.detail ? res.detail : res.image[0];
      throw new Error(detail);
    }
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function postBHDFile(url, token, data) {
  try {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response.status !== 201) {
      console.log('postBHDFile Error', response);
      throw new Error('Request Failed. Try Again!!');
    }
    return response; // parses JSON response into native JavaScript objects
  } catch (err) {
    console.log('postBHDFile Error', err);
    throw new Error('Request Failed. Try Again!!');
  }
}

export async function getBHDFile(url, token, data) {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

export const makeRequest = async (url, method, token, data = '') => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: method === 'GET' ? null : JSON.stringify(data),
    });

    const statusCode = response.status;

    if (statusCode === 204) return 'Successful';

    if (statusCode === 406) {
      const responseData = await response.json();
      throw new Error(responseData?.detail || 'Not Acceptable');
    }

    if (`${statusCode}`?.charAt(0) === '5')
      throw new Error(
        `Internal server error! Please try again after some time`
      );

    const responseData = await response.json();
    if (response.ok) return responseData;

    //  CASE: Response is an array w/ error message
    if (responseData?.length) throw new Error(`${responseData?.[0]}`);

    //  CASE: Response is a text
    // If an array throw the first one, else throw the message
    if (responseData?.detail) throw new Error(`${responseData?.detail}`);

    //  CASE: Response is a dictionary/object
    if (!responseData?.detail) {
      const targetKey = Object.keys(responseData)?.[0] ?? undefined;

      const errorMessage =
        responseData?.[targetKey]?.[0] ?? 'Something went wrong';

      throw new Error(`${errorMessage}`);
    }
  } catch (error) {
    throw new Error(
      `${
        error?.message ??
        `Something went wrong with error code ${error?.status}`
      }`
    );
  }
};
