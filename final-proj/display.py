import numpy as np
import open3d as o3d
import gradio as gr
import os
import threading

def visualize_point_cloud(pcd_path):
    if not os.path.exists(pcd_path):
        return "File not found"
    
    def run_visualization():
        pcd = o3d.io.read_point_cloud(pcd_path)
        vis = o3d.visualization.Visualizer()
        vis.create_window(visible=True)
        vis.add_geometry(pcd)
        
        # Set up the view
        vis.get_view_control().set_zoom(0.8)
        vis.get_render_option().point_size = 1.0
        
        # Run the visualization in a non-blocking way
        while vis.poll_events():
            vis.update_renderer()
        
        vis.destroy_window()
    
    # Run visualization in a separate thread
    thread = threading.Thread(target=run_visualization)
    thread.daemon = True  # Thread will be killed when main program exits
    thread.start()
    
    return "Visualization opened in new window"

# Create Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# Point Cloud Viewer")
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("## Original Point Cloud")
            original_btn = gr.Button("View Original")
            original_btn.click(
                fn=lambda: visualize_point_cloud("ak_master.ply"),
                outputs=gr.Textbox(label="Status")
            )
        
        with gr.Column():
            gr.Markdown("## Tattooed Point Cloud")
            tattoo_btn = gr.Button("View Tattooed")
            tattoo_btn.click(
                fn=lambda: visualize_point_cloud("ak_dragon_tattoo.ply"),
                outputs=gr.Textbox(label="Status")
            )

if __name__ == "__main__":
    demo.launch()
