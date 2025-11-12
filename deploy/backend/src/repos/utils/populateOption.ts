type PopulateLayer = {
  path: string;
  populate?: PopulateLayer | PopulateLayer[];
};

type PopulateOption = {
  populate?: (string | PopulateLayer)[];
};

export default PopulateOption;
