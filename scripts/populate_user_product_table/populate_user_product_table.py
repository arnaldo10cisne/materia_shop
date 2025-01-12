import boto3
import json
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError

def load_data_to_dynamodb(json_file_path, table_name, region='us-east-1'):
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(table_name)

    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File {json_file_path} not found.")
        return
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON file: {e}")
        return

    # Initialize the deserializer
    deserializer = TypeDeserializer()

    # Determine the data key ('users' or 'products')
    key = None
    if 'users' in data:
        key = 'users'
    elif 'products' in data:
        key = 'products'
    else:
        print(f"Error: Valid key ('users' or 'products') not found in JSON.")
        return

    # Iterate over the items and upload them to the table
    for item_wrapper in data[key]:
        item = item_wrapper.get('Item')
        if not item:
            print("Warning: 'Item' not found in the element. Skipping this element.")
            continue

        try:
            # Deserialize the item to convert it into a Python dictionary
            deserialized_item = {k: deserializer.deserialize(v) for k, v in item.items()}
        except Exception as e:
            print(f"Error deserializing item: {e}")
            continue

        try:
            # Upload the item to DynamoDB
            table.put_item(Item=deserialized_item)
            print(f"Item with id {deserialized_item.get('id')} uploaded successfully to table '{table_name}'.")
        except (NoCredentialsError, PartialCredentialsError):
            print("Error: AWS credentials not configured properly.")
            return
        except ClientError as e:
            print(f"Error uploading item with id {deserialized_item.get('id')} to table '{table_name}': {e.response['Error']['Message']}")
            continue
        except Exception as e:
            print(f"Unknown error uploading item with id {deserialized_item.get('id')} to table '{table_name}': {e}")
            continue

def main():
    region = 'us-east-1'

    # Users table data
    users_json_file = './data/users.json'
    users_table_name = 'MateriaShop__users-table'

    # Products table data
    products_json_file = './data/products.json'
    products_table_name = 'MateriaShop__products-table'

    # Load data into the Users table
    load_data_to_dynamodb(users_json_file, users_table_name, region)

    # Load data into the Products table
    load_data_to_dynamodb(products_json_file, products_table_name, region)

if __name__ == '__main__':
    main()
