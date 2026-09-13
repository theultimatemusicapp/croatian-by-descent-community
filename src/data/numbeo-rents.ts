export interface NumbeoRent {
  city: string;
  url: string;
  updated: string;
  contributors: string;
  oneCentre: string;
  oneOutside: string;
  threeCentre: string;
  threeOutside: string;
}

// Numbeo's published categories are one-bedroom and three-bedroom homes.
// They do not publish studio or two-bedroom averages for these city pages.
export const numbeoRents: Record<string, NumbeoRent> = {
  Zagreb: {
    city: 'Zagreb',
    url: 'https://www.numbeo.com/cost-of-living/in/Zagreb',
    updated: '10 June 2026',
    contributors: '1,253 entries / 186 contributors',
    oneCentre: '€768.75',
    oneOutside: '€576.25',
    threeCentre: '€1,253.85',
    threeOutside: '€936.54',
  },
  Split: {
    city: 'Split',
    url: 'https://www.numbeo.com/cost-of-living/in/Split',
    updated: '3 June 2026',
    contributors: '126 entries / 17 contributors',
    oneCentre: '€899.33',
    oneOutside: '€639.67',
    threeCentre: '€1,786.67',
    threeOutside: '€1,161.50',
  },
  Rijeka: {
    city: 'Rijeka',
    url: 'https://www.numbeo.com/cost-of-living/in/Rijeka',
    updated: '4 May 2026',
    contributors: '314 entries / 23 contributors',
    oneCentre: '€621.00',
    oneOutside: '€477.25',
    threeCentre: '€1,060.00',
    threeOutside: '€781.67',
  },
  Zadar: {
    city: 'Zadar',
    url: 'https://www.numbeo.com/cost-of-living/in/Zadar',
    updated: '20 May 2026',
    contributors: '232 entries / 30 contributors',
    oneCentre: '€796.40',
    oneOutside: '€614.40',
    threeCentre: '€1,283.33',
    threeOutside: '€1,022.67',
  },
  Dubrovnik: {
    city: 'Dubrovnik',
    url: 'https://www.numbeo.com/cost-of-living/in/Dubrovnik',
    updated: '4 May 2026',
    contributors: '34 contributors',
    oneCentre: '€1,310.00',
    oneOutside: '€821.00',
    threeCentre: '€1,787.50',
    threeOutside: '€1,092.50',
  },
  Pula: {
    city: 'Pula',
    url: 'https://www.numbeo.com/cost-of-living/in/Pula',
    updated: '19 June 2026',
    contributors: '27 contributors',
    oneCentre: '€637.50',
    oneOutside: '€480.00',
    threeCentre: '€1,162.50',
    threeOutside: '€871.50',
  },
  Osijek: {
    city: 'Osijek',
    url: 'https://www.numbeo.com/cost-of-living/in/Osijek',
    updated: '4 June 2026',
    contributors: '380 entries / 10 contributors',
    oneCentre: '€573.88',
    oneOutside: '€365.50',
    threeCentre: '€1,062.22',
    threeOutside: '€736.44',
  },
};
