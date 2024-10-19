import boto3
import pytest
from moto import mock_aws


def string_compare(expected: str, actual: str) -> None:
    if expected != actual:
        with open("expected.txt", "w") as expected:
            print(expected, file=expected)
        with open("compared.txt", "w") as compared:
            print(actual, file=compared)
    assert expected == actual


@pytest.fixture
def s3_bucket_and_s3():
    with mock_aws():
        # Set a default region, because some non-test code assumes one
        boto3.setup_default_session(region_name="us-east-1")

        s3 = boto3.client("s3", region_name="us-east-1")
        bucket_name = "test-bucket"
        s3.create_bucket(Bucket=bucket_name)
        yield bucket_name, s3
