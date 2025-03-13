import requests

# Function to post research to ResearchHub
def post_to_researchhub(title, content, dataset_link):
    url = "https://www.researchhub.com/api/posts"
    payload = {
        "title": title,
        "content": content,
        "metadata": {
            "dataset_link": dataset_link
        }
    }
    headers = {"Authorization": "Bearer YOUR_RESEARCHHUB_TOKEN"}
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to post to ResearchHub: {response.status_code}")

if __name__ == "__main__":
    # Example usage
    post_to_researchhub(
        title="New EEG Dataset Analysis",
        content="We analyzed a new EEG dataset using NeuroHarmony.",
        dataset_link="https://neuroharmony.com/datasets/123"
    )