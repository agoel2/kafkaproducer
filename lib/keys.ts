export const KEYS = {
    'ASSORTMENTS': ['productCode','channel'],
    'BADGES': ['code'],
    'CATEGORIES': ['code', 'parent'],
    'PRODUCTS_VARIANTS': ['identifier'],
    'PRODUCTS_BASE': ['code'],
    'CUSTOMERS_ONLINE': ['email', 'userType'],
    'CUSTOMERS_OFFLINE': ['email', 'userType'],
    'CUSTOMERS_MIGRATION': ['email', 'userType'],
    'DELETE_CUSTOMER': ['email'],
    'PRODUCTS_PRICES': ['productCode', 'priceListId', 'salesOrg', 'distributionChannel', 'fromDate', 'toDate'],
    'STOCK': ['product_id', 'fulfillment_group_id'],
    'CUSTOMERS_MARKETING_PREFERENCES': ['emailAddress'],
    'TRANSACTIONAL_EMAILS': ['to'],
    'RATINGS_AND_REVIEWS': ['productcode', 'locale'],
    'ORDERS_CREATE': ['external_id']
}