// this is to simulate an image search
// rather
export default query => {
  const options = [
    "method=flickr.photos.search",
    "api_key=1fd00dc5130478b5badd34f81e182bb0",
    "nojsoncallback=1",
    "format=json",
    "extras=url_m",
    "per_page=5",
    `tags=${query}`
  ];
  return (
    fetch(`https://api.flickr.com/services/rest/?${options.join("&")}`)
      .then(res => res.json())
      // inserting an artificial delay here
      // just to show the "searching" state
      .then(
        data =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(data);
            }, 1000);
          })
      )
      .then(data =>
        data.photos.photo.map(item => ({
          id: item.id,
          url: item.url_m
        }))
      )
  );
};
