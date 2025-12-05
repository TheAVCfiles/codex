# Gemini Robotics-ER 1.5 — Immersion Notes

Gemini Robotics-ER 1.5 is a preview vision-language model tuned for embodied reasoning. It fuses spatial perception with natural language planning so robots can interpret visual scenes, decompose open-ended commands, and sequence controller calls to execute long-horizon tasks.

## Core capabilities
- **Object finding & pointing:** Returns normalized 2D points or bounding boxes for detected objects in images or video frames. Supports both specific queries (e.g., “banana”) and abstract categories (e.g., “fruit”).
- **Spatial reasoning:** Understands affordances and object relationships to answer questions like what must move to make room for another item.
- **Trajectory planning:** Generates ordered waypoint lists for end-effector motion (e.g., picking a pen and placing it on an organizer).
- **Task orchestration:** Breaks down natural language goals into sequenced function calls against custom robot APIs (pick-and-place, etc.).
- **Tool use:** Can invoke code execution to crop/zoom images for clarity or call other user-defined tools.

## Input / output
- **Inputs:** Text plus images, video, or audio streams.
- **Outputs:** Text-only responses that often include structured JSON (points, bounding boxes, trajectories, or function-call plans).
- **Token limits:** Up to ~1,048,576 input tokens and ~65,536 output tokens in preview.

## Example: locate objects in an image (Python)
```python
from google import genai
from google.genai import types

MODEL_ID = "gemini-robotics-er-1.5-preview"
PROMPT = """
  Point to no more than 10 items in the image. The label returned should be an identifying name.
  Answer format: [{"point": <point>, "label": <label>}] with points in [y, x] normalized to 0-1000.
"""

client = genai.Client(api_key=YOUR_API_KEY)
with open("my-image.png", "rb") as f:
    image_bytes = f.read()

resp = client.models.generate_content(
    model=MODEL_ID,
    contents=[types.Part.from_bytes(data=image_bytes, mime_type="image/png"), PROMPT],
    config=types.GenerateContentConfig(
        temperature=0.5,
        thinking_config=types.ThinkingConfig(thinking_budget=0),
    ),
)
print(resp.text)
```

## Prompting patterns
- Ask for explicit JSON schemas; specify normalization (0–1000) and label uniqueness for multiple instances.
- Set `thinking_budget` near zero for fast perception tasks; raise it for complex counting or estimation.
- For videos, repeat the pointing prompt across frames to track objects over time.
- For grasping or placement, request step-numbered trajectories starting at the contact point.
- When using a custom robot API, describe available functions and coordinate conventions; request a JSON plan of function calls plus reasoning.

## Safety and limitations
- Preview model; APIs and behaviors may shift—test before production use.
- Generative outputs can be wrong; keep humans-in-the-loop for physical actions.
- Latency increases with high-resolution inputs, long videos, or larger thinking budgets.
- Accuracy depends on clear prompts and well-lit imagery; consider cropping/zooming and multiple-query consensus for precision.
- Respect privacy when capturing visual/audio data; avoid identifiable persons or apply blurring/consent workflows.

## Next steps
- Experiment in Google AI Studio with image uploads and natural language tasks.
- Pair the model with your existing controllers/behaviors to prototype end-to-end pick-and-place or rearrangement routines.
- Log outputs (points, boxes, and plans) into your proof ledger to evaluate consistency across scenes and sessions.
