export interface PincodeValidationResult {
  isValid: boolean;
  isMaharashtra: boolean;
  pincode: string;
  region?: string;
  message: string;
}

// Prefixes of PIN codes in Maharashtra and their designated regions
const MAHARASHTRA_PREFIXES: Record<string, string> = {
  '400': 'Mumbai & Navi Mumbai',
  '401': 'Palghar, Vasai-Virar & Thane Rural',
  '402': 'Raigad (Alibaug, Roha, Mahad)',
  '404': 'Konkan (Sindhudurg / Ratnagiri)',
  '410': 'Pune District (Lonavala / Talegaon)',
  '411': 'Pune City & Pimpri-Chinchwad',
  '412': 'Pune Rural (Baramati / Shirur)',
  '413': 'Solapur & Dharashiv (Osmanabad)',
  '414': 'Ahmednagar District',
  '415': 'Satara & Ratnagiri District',
  '416': 'Kolhapur & Sangli District',
  '421': 'Thane, Kalyan, Dombivli & Ulhasnagar',
  '422': 'Nashik City',
  '423': 'Nashik Rural (Malegaon / Manmad)',
  '424': 'Dhule District',
  '425': 'Jalgaon District',
  '431': 'Chh. Sambhajinagar (Aurangabad), Jalna & Nanded',
  '440': 'Nagpur City',
  '441': 'Nagpur Rural, Bhandara & Gondia',
  '442': 'Wardha, Chandrapur & Gadchiroli',
  '443': 'Buldhana District',
  '444': 'Akola, Amravati & Washim',
  '445': 'Yavatmal District',
};

// Known other states sample prefixes for helpful feedback
const OTHER_STATE_PREFIXES: Record<string, string> = {
  '11': 'Delhi',
  '12': 'Haryana',
  '13': 'Haryana / Punjab',
  '14': 'Punjab',
  '15': 'Punjab',
  '16': 'Chandigarh',
  '17': 'Himachal Pradesh',
  '18': 'Jammu & Kashmir',
  '19': 'Jammu & Kashmir',
  '20': 'Uttar Pradesh',
  '21': 'Uttar Pradesh',
  '22': 'Uttar Pradesh',
  '23': 'Uttar Pradesh',
  '24': 'Uttarakhand / UP',
  '25': 'Uttar Pradesh',
  '26': 'Uttarakhand',
  '27': 'Uttar Pradesh',
  '28': 'Uttar Pradesh',
  '30': 'Rajasthan',
  '31': 'Rajasthan',
  '32': 'Rajasthan',
  '33': 'Rajasthan',
  '34': 'Rajasthan',
  '36': 'Gujarat',
  '37': 'Gujarat',
  '38': 'Gujarat',
  '39': 'Gujarat',
  '403': 'Goa',
  '45': 'Madhya Pradesh',
  '46': 'Madhya Pradesh',
  '47': 'Madhya Pradesh',
  '48': 'Madhya Pradesh',
  '49': 'Chhattisgarh',
  '50': 'Telangana',
  '51': 'Andhra Pradesh',
  '52': 'Andhra Pradesh',
  '53': 'Andhra Pradesh',
  '56': 'Karnataka (Bengaluru)',
  '57': 'Karnataka',
  '58': 'Karnataka',
  '59': 'Karnataka',
  '60': 'Tamil Nadu (Chennai)',
  '61': 'Tamil Nadu',
  '62': 'Tamil Nadu',
  '63': 'Tamil Nadu',
  '64': 'Tamil Nadu',
  '67': 'Kerala',
  '68': 'Kerala',
  '69': 'Kerala',
  '70': 'West Bengal (Kolkata)',
  '71': 'West Bengal',
  '72': 'West Bengal',
  '73': 'West Bengal',
  '74': 'West Bengal',
  '75': 'Odisha',
  '76': 'Odisha',
  '77': 'Odisha',
  '78': 'Assam & North East',
  '79': 'North East States',
  '80': 'Bihar',
  '81': 'Bihar',
  '82': 'Jharkhand',
  '83': 'Jharkhand',
  '84': 'Bihar',
  '85': 'Bihar',
};

export function validateMaharashtraPincode(pin: string): PincodeValidationResult {
  const cleanPin = pin.trim().replace(/\D/g, '');

  if (cleanPin.length !== 6) {
    return {
      isValid: false,
      isMaharashtra: false,
      pincode: cleanPin,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  // 403xxx is specifically Goa, which is adjacent to Maharashtra but a separate state
  if (cleanPin.startsWith('403')) {
    return {
      isValid: true,
      isMaharashtra: false,
      pincode: cleanPin,
      region: 'Goa',
      message: 'PIN code belongs to Goa. GIFTORIA currently delivers exclusively across Maharashtra.',
    };
  }

  const prefix3 = cleanPin.slice(0, 3);
  const prefix2 = cleanPin.slice(0, 2);

  // Check if it belongs to Maharashtra
  if (MAHARASHTRA_PREFIXES[prefix3]) {
    const region = MAHARASHTRA_PREFIXES[prefix3];
    return {
      isValid: true,
      isMaharashtra: true,
      pincode: cleanPin,
      region,
      message: `Delivery available to ${region} (Maharashtra)`,
    };
  }

  // Check if it starts with 40-44 (General Maharashtra range fallback)
  const pinNum = parseInt(cleanPin, 10);
  if (pinNum >= 400001 && pinNum <= 445999) {
    return {
      isValid: true,
      isMaharashtra: true,
      pincode: cleanPin,
      region: 'Maharashtra Service Zone',
      message: 'Delivery available across Maharashtra',
    };
  }

  // Other state detected
  const otherState = OTHER_STATE_PREFIXES[prefix3] || OTHER_STATE_PREFIXES[prefix2] || 'another state';
  return {
    isValid: true,
    isMaharashtra: false,
    pincode: cleanPin,
    region: otherState,
    message: `PIN code belongs to ${otherState}. GIFTORIA currently delivers exclusively within Maharashtra.`,
  };
}

export const DEFAULT_PINCODE = '400001';
export const DEFAULT_PINCODE_LABEL = '400001 (Mumbai, MH)';
