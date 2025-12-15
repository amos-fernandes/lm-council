
import time

def check(module_name):
    t0 = time.time()
    print(f"Importing {module_name}...", end="", flush=True)
    try:
        __import__(module_name)
        print(f" OK ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f" FAILED: {e}")

check("json")
check("os")
check("random")
check("re")
check("aiohttp")
check("instructor")
check("matplotlib.pyplot")
check("numpy")
check("pandas")
check("requests")
check("seaborn")
check("tqdm.asyncio")
check("aiolimiter")
check("datasets")
check("huggingface_hub")
check("openai")
print("All external deps checked.")

print("Importing lm_council.council...")
try:
    import lm_council.council
    print("lm_council.council OK")
except Exception as e:
    print(f"lm_council.council FAILED: {e}")
