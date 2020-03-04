export const Map = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=30.269685%2C59.949614&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNTk2NDQ0MzI4ElDQoNC-0YHRgdC40Y8sINCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCzLCDQo9GA0LDQu9GM0YHQutCw0Y8g0YPQu9C40YbQsCwgMdC6MiIKDVAo8kEVaMxvQg%2C%2C&z=15.05"
        width="100%"
        height="400"
          allowFullScreen
        className="relative"
      ></iframe>
    </div>
  );
};
