const menu = [
  'Dashboard',
  'News',
  'Categories',
  'Media',
  'Authors',
  'Comments',
  'SEO',
  'Users',
  'Roles',
  'Settings'
];

const quickStats = [
  { label: 'Live editors', value: '0' },
  { label: 'Published today', value: '0' },
  { label: 'Drafts', value: '0' },
  { label: 'Pending review', value: '0' }
];

const publishingSteps = [
  'Write the story',
  'Attach image or video',
  'Choose category',
  'Set SEO title and slug',
  'Save draft or publish',
  'Send to homepage queue'
];

const contentBlocks = [
  'Top headline strip',
  'Breaking news ticker',
  'Featured story',
  'Category section',
  'Video block',
  'Most read block'
];

const settings = [
  'Arabic RTL layout',
  'Mobile-first homepage',
  'Author approval workflow',
  'Featured image required',
  'Slug auto-generation',
  'Scheduled publishing'
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#132126]">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-black/8 bg-[#0f1d25] text-white lg:border-b-0 lg:border-l lg:border-black/8">
          <div className="p-6">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <div className="text-xs uppercase tracking-[0.32em] text-white/55">Sawt Al-Hind News</div>
              <div className="mt-2 text-3xl font-bold leading-tight">???? ??????</div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                ????? ??????? ???????? ?????? ???????? ???????? ???????? ?????? ?? ???? ????.
              </p>
            </div>
          </div>

          <nav className="grid gap-1 px-4 pb-6 text-sm font-medium">
            {menu.map((item, index) => (
              <a
                key={item}
                href="#"
                className={`rounded-2xl px-4 py-3 transition ${
                  index === 0 ? 'bg-white text-[#0f1d25]' : 'text-white/80 hover:bg-white/8 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <section className="p-4 sm:p-6 lg:p-8">
          <header className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6a7f86]">Admin CMS</div>
                <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Arabic news workflow, built for daily publishing
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">
                  No demo stories, no fake analytics. This panel is ready for real news operations:
                  create, schedule, approve, upload media, and place stories on the homepage.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-[#0f1d25] px-5 py-3 text-sm font-semibold text-white">
                  New story
                </button>
                <button className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                  Upload media
                </button>
                <button className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                  Open queue
                </button>
              </div>
            </div>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-[26px] border border-black/8 bg-white p-5 shadow-sm">
                <div className="text-sm text-black/55">{stat.label}</div>
                <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">{stat.value}</div>
                <div className="mt-4 h-1.5 rounded-full bg-black/6">
                  <div className="h-1.5 w-0 rounded-full bg-[#0f1d25]" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Create and publish</h2>
                <span className="text-sm font-medium text-[#0f1d25]">News editor</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Title" />
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Slug" />
                  <input className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none" placeholder="Author name" />
                  <select className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none">
                    <option>Choose category</option>
                    <option>Breaking News</option>
                    <option>Politics</option>
                    <option>World</option>
                    <option>Economy</option>
                    <option>Sports</option>
                    <option>Culture</option>
                    <option>Religion</option>
                    <option>Video</option>
                  </select>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">
                      Schedule publish
                    </button>
                    <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">
                      Send for review
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    className="min-h-[250px] w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none"
                    placeholder="Write the full article here..."
                  />
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-2xl bg-[#0f1d25] px-4 py-3 font-semibold text-white">Save draft</button>
                    <button className="rounded-2xl bg-[#d3ab57] px-4 py-3 font-semibold text-[#0f1d25]">Publish now</button>
                    <button className="rounded-2xl border border-black/10 px-4 py-3 font-semibold">Preview</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Media library</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Images and video</span>
              </div>
              <div className="rounded-[26px] border-2 border-dashed border-[#7ca3a2]/30 bg-[#f0f7f6] p-6 text-center">
                <div className="text-4xl">?</div>
                <div className="mt-3 text-lg font-semibold">Drop files here</div>
                <p className="mt-2 text-sm leading-7 text-black/60">
                  JPG, PNG, WebP, MP4, and PDF. Use real file names, alt text, and source credits.
                </p>
                <button className="mt-4 rounded-full bg-[#0f1d25] px-5 py-3 text-sm font-semibold text-white">
                  Select files
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="text-sm font-semibold text-black/60">Upload checklist</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Alt text required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Featured image required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Video caption required</div>
                <div className="rounded-2xl border border-black/8 px-4 py-3">Copyright source required</div>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Categories and homepage blocks</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Structure</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {contentBlocks.map((item) => (
                  <div key={item} className="rounded-2xl border border-black/8 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[26px] bg-[#f6f8f8] p-4">
                <div className="text-sm font-semibold text-black/60">Category manager</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Add category</button>
                  <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Sort order</button>
                  <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Hide empty categories</button>
                  <button className="rounded-2xl border border-black/10 px-4 py-3 text-right font-medium">Homepage pin</button>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
                <h2 className="text-xl font-bold tracking-[-0.02em]">Publishing workflow</h2>
                <span className="text-sm font-medium text-[#0f1d25]">Operations</span>
              </div>

              <div className="space-y-3">
                {publishingSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl border border-black/8 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f1d25] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{step}</div>
                      <div className="mt-1 text-sm text-black/55">
                        No mock content. Connect this panel to your database, then these steps drive the live newsroom.
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[26px] bg-[#f6f8f8] p-4">
                <div className="text-sm font-semibold text-black/60">Newsroom settings</div>
                <div className="mt-3 grid gap-3">
                  {settings.map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-2xl border border-black/8 px-4 py-3">
                      <span>{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#0f1d25]" />
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 rounded-[30px] border border-black/8 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-black/8 pb-3">
              <h2 className="text-xl font-bold tracking-[-0.02em]">Moderation and approvals</h2>
              <span className="text-sm font-medium text-[#0f1d25]">Queue is empty</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">Comments moderation</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Approve, reject, or auto-filter comments before they appear on the site.
                </p>
              </div>
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">Author approvals</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Restrict publishing rights, draft editing, and scheduled story approvals by role.
                </p>
              </div>
              <div className="rounded-[24px] border border-black/8 p-5">
                <div className="text-sm text-black/55">SEO checklist</div>
                <p className="mt-3 text-sm leading-7 text-black/65">
                  Title, description, canonical URL, image alt text, and schema before publish.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
