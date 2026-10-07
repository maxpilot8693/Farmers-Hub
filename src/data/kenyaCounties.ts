import { KenyaCounty } from '../types';

export const KENYA_COUNTIES: KenyaCounty[] = [
  {
    name: 'Kericho',
    code: '035',
    subCounties: [
      { name: 'Bureti', wards: ['Chemosit', 'Litein', 'Cheplanget', 'Kapkatet'] },
      { name: 'Belgut', wards: ['Kabianga', 'Waldai', 'Chaik', 'Kipriere'] },
      { name: 'Ainamoi', wards: ['Kipchebor', 'Kapsoit', 'Ainamoi', 'Kipchimchim'] },
      { name: 'Kipkelion East', wards: ['Londiani', 'Kedowa/Kimugul', 'Chepseon'] },
      { name: 'Kipkelion West', wards: ['Kipkelion', 'Chilchila', 'Kamasian'] },
      { name: 'Soin/Sigowet', wards: ['Sigowet', 'Soin', 'Soliat'] },
    ],
  },
  {
    name: 'Nakuru',
    code: '032',
    subCounties: [
      { name: 'Naivasha', wards: ['Viwandani', 'Hellsgate', 'Olkaria', 'Mai Mahiu', 'Lake View'] },
      { name: 'Nakuru West', wards: ['Barut', 'London', 'Kaptembwo', 'Rhoda'] },
      { name: 'Nakuru East', wards: ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai'] },
      { name: 'Molo', wards: ['Molo', 'Elburgon', 'Tinet', 'Mariashoni'] },
      { name: 'Rongai', wards: ['Menengai West', 'Solem', 'Visoi', 'Mosop'] },
      { name: 'Subukia', wards: ['Subukia', 'Waseges', 'Kabazi'] },
      { name: 'Gilgil', wards: ['Gilgil', 'Elementaita', 'Mbaruk/Eburu'] },
    ],
  },
  {
    name: 'Kiambu',
    code: '022',
    subCounties: [
      { name: 'Gatundu South', wards: ['Kiamwangi', 'Kiganjo', 'Ndusu', 'Ngenda'] },
      { name: 'Ruiru', wards: ['Gitothua', 'Biashara', 'Gatongora', 'Kahawa Sukari'] },
      { name: 'Thika Town', wards: ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga'] },
      { name: 'Kiambu Town', wards: ['Ting\'ang\'a', 'Ndumberi', 'Riabai', 'Township'] },
      { name: 'Limuru', wards: ['Limuru Central', 'Ndeiya', 'Bibirioni', 'Limuru East'] },
      { name: 'Kikuyu', wards: ['Karai', 'Kikuyu', 'Sigona', 'Kabete'] },
    ],
  },
  {
    name: 'Uasin Gishu',
    code: '027',
    subCounties: [
      { name: 'Ainabkoi', wards: ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare'] },
      { name: 'Kapseret', wards: ['Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Langas'] },
      { name: 'Kesses', wards: ['Racecourse', 'Tarakwa', 'Cheptiret/Kipchamo'] },
      { name: 'Moiben', wards: ['Moiben', 'Kitemu', 'Sergoit', 'Karcin'] },
      { name: 'Turbo', wards: ['Ngenyilel', 'Tapsagoi', 'Kamagut', 'Huruma'] },
    ],
  },
  {
    name: 'Meru',
    code: '012',
    subCounties: [
      { name: 'Imenti South', wards: ['Mitiine', 'Abogeta East', 'Abogeta West', 'Nkuene'] },
      { name: 'Imenti North', wards: ['Municipality', 'Ntima East', 'Ntima West', 'Nyaki West'] },
      { name: 'Buuri', wards: ['Timau', 'Kibirichia', 'Ruiri/Rwarera'] },
      { name: 'Tigania West', wards: ['Athwana', 'Akithi', 'Kianjai'] },
    ],
  },
  {
    name: 'Nyeri',
    code: '019',
    subCounties: [
      { name: 'Mathira', wards: ['Iria-ini', 'Magutu', 'Kirimukuyu', 'Konyu'] },
      { name: 'Othaya', wards: ['Mahiga', 'Iria-ini', 'Chinga', 'Karima'] },
      { name: 'Kieni East', wards: ['Gakawa', 'Naromoru', 'Thengu'] },
      { name: 'Kieni West', wards: ['Mweiga', 'Gatarakwa', 'Endarasha'] },
    ],
  },
  {
    name: 'Nandi',
    code: '029',
    subCounties: [
      { name: 'Nandi Hills', wards: ['Nandi Hills', 'Chepterwai', 'Kapchorwa'] },
      { name: 'Chesumei', wards: ['Chepterwai', 'Lelmokwo/Ngechek', 'Kaptel/Kamoiywo'] },
      { name: 'Aldai', wards: ['Kabwareng', 'Terik', 'Kemeloi-Maraba'] },
    ],
  },
  {
    name: 'Machakos',
    code: '016',
    subCounties: [
      { name: 'Mavoko', wards: ['Athi River', 'Syokimau/Mulolongo', 'Kinanie'] },
      { name: 'Machakos Town', wards: ['Machakos Central', 'Muvuti/Kiima-Kimwe', 'Kalama'] },
      { name: 'Kangundo', wards: ['Kangundo Central', 'Kangundo East', 'Kangundo West'] },
    ],
  },
  {
    name: 'Bomet',
    code: '036',
    subCounties: [
      { name: 'Sotik', wards: ['Ndanai/Abosi', 'Chemagal', 'Kipsonoi', 'Ason'] },
      { name: 'Konoin', wards: ['Kimulot', 'Mogogosiek', 'Boito', 'Embomos'] },
      { name: 'Bomet Central', wards: ['Siloam', 'Singorwet', 'Ndaraweta'] },
    ],
  },
  {
    name: 'Nairobi',
    code: '047',
    subCounties: [
      { name: 'Westlands', wards: ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi'] },
      { name: 'Dagoretti', wards: ['Mutu-ini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu'] },
      { name: 'Lang\'ata', wards: ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C'] },
    ],
  },
];
