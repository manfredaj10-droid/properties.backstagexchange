function mapProperty(property) {
    return {
        id: property.id,
        title: property.title,
        location: property.location,

        type: property.listing.toLowerCase().includes("rent")
            ? "rent"
            : "sale",

        category: property.type,

        bhk: property.beds,
        bath: property.baths,
        sqft: property.sqft,

        priceRaw: Number(property.price),

        agent: {
            name: property.agent_name,
            phone: property.agent_phone,
            email: property.agent_email
        },

        img: property.photos[0],
        galleryImages: property.photos
    };
}


// export const mapProperty = (property) => {
//   const photos = Array.isArray(property.photos)
//     ? property.photos
//     : [];

//   const agentName = property.agent_name || 'Unknown Agent';

//   const initials = agentName
//     .split(' ')
//     .filter(Boolean)
//     .map(word => word[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();

//   return {
//     id: Number(property.id),

//     title: property.title || '',
//     location: property.location || '',

//     price: `₹ ${property.price}`,
//     priceRaw: Number(property.price) || 0,

//     // "For Sale" → "sale"
//     // "For Rent" → "rent"
//     type:
//       property.listing?.toLowerCase().includes('rent')
//         ? 'rent'
//         : 'sale',

//     // Villa, Apartment, Commercial, etc.
//     category: property.type || '',

//     bhk: property.beds || '',
//     bath: property.baths || '',
//     sqft: property.sqft ? `${property.sqft} sqft` : '',

//     description: property.description || '',
//     area: property.area || '',

//     highlight: '',

//     agent: {
//       name: agentName,
//       initials: initials || 'AG',
//       color: '#457b9d',
//       phone: property.agent_phone || '',
//       email: property.agent_email || '',
//     },

//     // First image becomes the card image
//     img: photos[0] || '',

//     // All images become the gallery
//     galleryImages: photos,

//     amenities: Array.isArray(property.amenities)
//       ? property.amenities
//       : [],
//   };
// };


// export const mapProperties = (properties) => {
//   if (!Array.isArray(properties)) {
//     return [];
//   }

//   return properties.map(mapProperty);
// };