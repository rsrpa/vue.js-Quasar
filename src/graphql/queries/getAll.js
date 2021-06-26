import gql from 'graphql-tag'

export default gql`
  query getAll(
    $locations: Boolean = false
    $maps: Boolean = false
    $favs: Boolean = false
    $favsGroups: Boolean = false
    $groups: Boolean = false
    $items: Boolean = false
    $favMap: Boolean = false
    $favSupply: Boolean = false
    $supplySOH: Boolean = false
    $subs: Boolean = false
    $soh: Boolean = false
    $supply: Boolean = false
    $inventories: Boolean = false
    $templates: Boolean = false
    $orders: Boolean = false
    $mapSupply: Boolean = false
    $mapsTypeR: Boolean = false
    $ordersLimit: Int
    $stocktakes: Boolean = false
    $transactions: Boolean = false
    $supplyTypeR: Boolean = false
    $company: Boolean = false
    $accountDataBackorder: Boolean = false
    $transactionsLimit: Int
    $supplyId: String
    $supplyNextToken: String
    $mapNextToken: String
    $mapId: String
    $locationId: String
    $inventoriesLocation: String
    $templateId: String
    $orderId: String
    $stocktakeId: String
    $favId: String
    $favsGroupId: String
    $supplyTypeRId: String
  ) {
    getAll {
      accountDataBackorder @include(if: $accountDataBackorder) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
      }
      company @include(if: $company) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        addresses {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
        }
      }
      locations(pk: $locationId) @include(if: $locations) {
        pk
        sk
        v1
        _version
      }
      mapsTypeR(pk: $mapId, nextToken: $mapNextToken) @include(if: $mapsTypeR) {
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
          supply {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
            v6
            _version
          }
        }
        nextToken
      }
      supplyTypeR(pk: $supplyTypeRId, nextToken: $supplyNextToken)
        @include(if: $supplyTypeR) {
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          v6
          _version
          soh @include(if: $supplySOH) {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
          }
        }
        nextToken
      }
      favsGroups(pk: $favsGroupId) @include(if: $favsGroups) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
      }
      favs(pk: $favId) @include(if: $favs) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        groups @include(if: $groups) {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
          items @include(if: $items) {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            gsi3sk
            v1
            v2
            v3
            v4
            v5
            _version
            supply @include(if: $favSupply) {
              pk
              sk
              gsi1pk
              gsi1sk
              gsi2pk
              gsi2sk
              v1
              v2
              v3
              v4
              v5
              v6
              v7
              _version
              soh @include(if: $soh) {
                pk
                sk
                gsi1pk
                gsi1sk
                gsi2pk
                gsi2sk
                v1
                v2
                v3
                v4
              }
              subs @include(if: $subs) {
                gsi1pk
                gsi1sk
                gsi3pk
                gsi3sk
                v1
                sub {
                  pk
                  sk
                  gsi1pk
                  gsi1sk
                  gsi2pk
                  gsi2sk
                  v1
                  v2
                  v3
                  v4
                  v5
                  v6
                }
              }
            }
            map @include(if: $favMap) {
              pk
              sk
              gsi1pk
              gsi1sk
              gsi2pk
              gsi2sk
              v1
              v2
              v3
              v4
              v5
              _version
              supply @include(if: $mapSupply) {
                pk
                sk
                gsi1pk
                gsi1sk
                gsi2pk
                gsi2sk
                v1
                v2
                v3
                v4
                v5
                v6
                v7
                subs @include(if: $subs) {
                  gsi1pk
                  gsi1sk
                  gsi3pk
                  gsi3sk
                  sub {
                    pk
                    sk
                    gsi1pk
                    gsi1sk
                    gsi2pk
                    gsi2sk
                    v1
                    v2
                    v3
                    v4
                    v5
                    v6
                  }
                }
                _version
              }
            }
          }
        }
      }
      maps(pk: $mapId) @include(if: $maps) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        supply {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
        }
      }
      supply(pk: $supplyId, nextToken: $supplyNextToken) @include(if: $supply) {
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
        }
        nextToken
      }
      transactions(limit: $transactionsLimit) @include(if: $transactions) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        v6
        v7
        map {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
        }
        locationFrom {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
        }
        locationTo {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
        }
      }
      templates(pk: $templateId) @include(if: $templates) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
          map {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
            supply {
              pk
              sk
              gsi1pk
              gsi1sk
              gsi2pk
              gsi2sk
              v1
              v2
              v3
              v4
              v5
            }
          }
        }
      }
      orders(pk: $orderId, limit: $ordersLimit) @include(if: $orders) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
          _lastChangedAt
          map {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
            supply {
              pk
              sk
              gsi1pk
              gsi1sk
              gsi2pk
              gsi2sk
              v1
              v2
              v3
              v4
              v5
            }
          }
        }
      }
      stocktakes(pk: $stocktakeId) @include(if: $stocktakes) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        items {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          _version
          _lastChangedAt
          location {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
          }
          map {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
            _version
            supply {
              pk
              sk
              gsi1pk
              gsi1sk
              gsi2pk
              gsi2sk
              v1
              v2
              v3
              v4
              v5
            }
          }
        }
      }
      inventories(gsi2pk: $inventoriesLocation) @include(if: $inventories) {
        pk
        sk
        gsi1pk
        gsi1sk
        gsi2pk
        gsi2sk
        v1
        v2
        v3
        v4
        v5
        _version
        _lastChangedAt
        location {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v3
          v4
          v5
        }
        map {
          pk
          sk
          gsi1pk
          gsi1sk
          gsi2pk
          gsi2sk
          v1
          v2
          v3
          v4
          v5
          supply {
            pk
            sk
            gsi1pk
            gsi1sk
            gsi2pk
            gsi2sk
            v1
            v2
            v3
            v4
            v5
          }
        }
      }
    }
  }
`
