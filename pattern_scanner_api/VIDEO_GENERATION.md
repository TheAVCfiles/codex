# Video Generation (MP4) - Future Enhancement

## Overview

Video generation with intro/outro overlays is an optional enhancement for the Pattern Scanner API. This document outlines how to implement this feature when needed.

## Why It's Optional

The current implementation focuses on:
1. CSV reports (✅ Implemented with branding)
2. Text summaries (✅ Implemented with branding)

Video generation adds significant complexity:
- Large dependencies (ffmpeg, moviepy)
- Higher compute requirements
- Longer processing times
- More storage needed

## Implementation Plan

### Dependencies

Add to `requirements.txt`:
```
moviepy==1.0.3
pillow==10.4.0
```

System dependencies (Docker):
```dockerfile
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*
```

### Video Generation Function

```python
from moviepy.editor import (
    VideoClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips
)
from PIL import Image, ImageDraw, ImageFont
import numpy as np

def create_branded_video(analysis_data: dict, output_path: str) -> str:
    """
    Create an MP4 video with analysis visualization
    
    Args:
        analysis_data: Results from pattern analysis
        output_path: Path to save MP4 file
    
    Returns:
        Path to generated video file
    """
    # Video settings
    width, height = 1920, 1080
    fps = 30
    
    # Create intro clip (5 seconds)
    intro = create_intro_clip(width, height, fps)
    
    # Create content clips (pattern visualizations)
    content_clips = []
    
    # Summary slide
    summary_clip = create_summary_slide(
        analysis_data['total_events'],
        analysis_data['unique_patterns'],
        width, height, fps,
        duration=8
    )
    content_clips.append(summary_clip)
    
    # Pattern breakdown slides
    for pattern, count in analysis_data['unique_patterns'].items():
        clip = create_pattern_slide(
            pattern, count, width, height, fps,
            duration=5
        )
        content_clips.append(clip)
    
    # Sequence visualization
    if analysis_data['sequence_counts']:
        seq_clip = create_sequence_slide(
            analysis_data['sequence_counts'],
            width, height, fps,
            duration=8
        )
        content_clips.append(seq_clip)
    
    # Create outro clip (3 seconds)
    outro = create_outro_clip(width, height, fps)
    
    # Concatenate all clips
    final_video = concatenate_videoclips(
        [intro] + content_clips + [outro]
    )
    
    # Write to file
    final_video.write_videofile(
        output_path,
        fps=fps,
        codec='libx264',
        audio=False,
        threads=4
    )
    
    return output_path


def create_intro_clip(width: int, height: int, fps: int) -> VideoClip:
    """Create branded intro sequence"""
    def make_frame(t):
        # Create gradient background
        img = Image.new('RGB', (width, height), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        # Add title with fade-in effect
        opacity = min(255, int(t * 255 / 2))
        
        # Draw title
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        title = "Chat Pattern Scanner"
        
        # Center text
        bbox = draw.textbbox((0, 0), title, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2 - 100
        
        draw.text((x, y), title, fill=(255, 255, 255, opacity), font=font)
        
        # Subtitle
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        subtitle = "Powered by TheAVCfiles"
        bbox = draw.textbbox((0, 0), subtitle, font=font_small)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y += 120
        
        draw.text((x, y), subtitle, fill=(255, 255, 255, opacity), font=font_small)
        
        return np.array(img)
    
    return VideoClip(make_frame, duration=5)


def create_summary_slide(total_events: int, patterns: dict, 
                        width: int, height: int, fps: int,
                        duration: int = 8) -> VideoClip:
    """Create summary statistics slide"""
    def make_frame(t):
        img = Image.new('RGB', (width, height), color='#ffffff')
        draw = ImageDraw.Draw(img)
        
        # Title
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        title = "Analysis Summary"
        bbox = draw.textbbox((0, 0), title, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 100), title, fill='#333333', font=font_title)
        
        # Total events
        font_stat = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 50)
        stat_text = f"Total Events: {total_events}"
        bbox = draw.textbbox((0, 0), stat_text, font=font_stat)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 250), stat_text, fill='#667eea', font=font_stat)
        
        # Pattern count
        pattern_count_text = f"Pattern Categories: {len(patterns)}"
        bbox = draw.textbbox((0, 0), pattern_count_text, font=font_stat)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 350), pattern_count_text, fill='#667eea', font=font_stat)
        
        return np.array(img)
    
    return VideoClip(make_frame, duration=duration)


def create_pattern_slide(pattern_name: str, count: int,
                        width: int, height: int, fps: int,
                        duration: int = 5) -> VideoClip:
    """Create individual pattern visualization slide"""
    def make_frame(t):
        img = Image.new('RGB', (width, height), color='#f8f9fa')
        draw = ImageDraw.Draw(img)
        
        # Pattern name
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        title = pattern_name.replace('_', ' ')
        bbox = draw.textbbox((0, 0), title, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 200), title, fill='#333333', font=font_title)
        
        # Count with animation
        progress = min(1.0, t / (duration * 0.7))
        current_count = int(count * progress)
        
        font_count = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        count_text = str(current_count)
        bbox = draw.textbbox((0, 0), count_text, font=font_count)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 400), count_text, fill='#667eea', font=font_count)
        
        # Label
        font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        label = "occurrences"
        bbox = draw.textbbox((0, 0), label, font=font_label)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 600), label, fill='#666666', font=font_label)
        
        return np.array(img)
    
    return VideoClip(make_frame, duration=duration)


def create_sequence_slide(sequences: dict, width: int, height: int, 
                         fps: int, duration: int = 8) -> VideoClip:
    """Create sequence patterns slide"""
    def make_frame(t):
        img = Image.new('RGB', (width, height), color='#ffffff')
        draw = ImageDraw.Draw(img)
        
        # Title
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        title = "Pattern Sequences"
        bbox = draw.textbbox((0, 0), title, font=font_title)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, 100), title, fill='#333333', font=font_title)
        
        # List sequences
        font_seq = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 35)
        y_offset = 250
        
        for i, (seq, count) in enumerate(sequences.items()):
            if i >= 5:  # Limit to 5 sequences per slide
                break
            
            seq_text = f"{seq}: {count}"
            draw.text((200, y_offset), seq_text, fill='#667eea', font=font_seq)
            y_offset += 80
        
        return np.array(img)
    
    return VideoClip(make_frame, duration=duration)


def create_outro_clip(width: int, height: int, fps: int) -> VideoClip:
    """Create branded outro sequence"""
    def make_frame(t):
        img = Image.new('RGB', (width, height), color='#764ba2')
        draw = ImageDraw.Draw(img)
        
        # Fade out effect
        opacity = int(255 * (1 - t / 3))
        
        # Footer text
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        footer = "TheAVCfiles Pattern Scanner"
        
        bbox = draw.textbbox((0, 0), footer, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = (height - 100) // 2
        
        draw.text((x, y), footer, fill=(255, 255, 255, opacity), font=font)
        
        # URL
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
        url = "github.com/TheAVCfiles/codex"
        bbox = draw.textbbox((0, 0), url, font=font_small)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        
        draw.text((x, y + 80), url, fill=(255, 255, 255, opacity), font=font_small)
        
        return np.array(img)
    
    return VideoClip(make_frame, duration=3)
```

### API Endpoint

Add to `main.py`:

```python
@app.post("/analyze-video")
async def analyze_chat_log_with_video(
    file: UploadFile = File(...),
    payment_intent_id: Optional[str] = None
):
    """
    Analyze chat log and generate MP4 video report.
    
    **Pricing**: $10.00 per analysis with video
    """
    # Verify payment (higher price for video)
    await verify_payment(payment_intent_id, amount=1000)  # $10
    
    # Process chat log
    result = process_chat_log(file_content)
    
    # Generate video
    video_path = f"/tmp/analysis_{uuid.uuid4()}.mp4"
    create_branded_video(result, video_path)
    
    # Return video file
    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename="pattern_analysis.mp4"
    )
```

### Frontend Integration

```javascript
// Request video analysis
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('payment_intent_id', paymentId);

const response = await fetch('/analyze-video', {
    method: 'POST',
    body: formData
});

const blob = await response.blob();
const videoUrl = URL.createObjectURL(blob);

// Display video
const video = document.createElement('video');
video.src = videoUrl;
video.controls = true;
document.body.appendChild(video);
```

## Implementation Steps

1. Add video generation dependencies
2. Update Dockerfile with ffmpeg
3. Implement video generation functions
4. Add `/analyze-video` endpoint
5. Test video generation locally
6. Update pricing (e.g., $10 for video vs $5 for CSV)
7. Add video download to frontend
8. Update documentation

## Performance Considerations

- Video generation takes 30-60 seconds
- Consider async task queue (Celery, RQ)
- May need larger instance size on Fly.io
- Storage for temporary video files
- CDN for video delivery

## Alternative: Static Charts

Instead of full video, consider static visualizations:
- Generate PNG charts with matplotlib
- Include in ZIP download with CSV files
- Faster, cheaper, simpler

Example:
```python
import matplotlib.pyplot as plt

def create_pattern_chart(patterns: dict) -> str:
    plt.figure(figsize=(12, 6))
    plt.bar(patterns.keys(), patterns.values())
    plt.title('Pattern Detection Summary')
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    chart_path = '/tmp/patterns.png'
    plt.savefig(chart_path, dpi=300)
    return chart_path
```

## Recommendation

Start with CSV/text reports (current implementation). Add video generation only if:
1. Users specifically request it
2. Willing to pay premium ($10-15 vs $5)
3. Have infrastructure to handle longer processing

For most use cases, CSV reports with branding are sufficient.
